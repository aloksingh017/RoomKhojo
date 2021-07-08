const Room = require('../models/rooms')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder= mbxGeocoding({accessToken:mapBoxToken})
const {cloudinary} = require('../cloudinary')

module.exports.index = async (req,res)=>{
    const rooms = await Room.find({})
    res.render('room/index',{rooms})
}
module.exports.renderNewForm = (req,res)=>{
    res.render('room/new')
}
module.exports.createRoom = async (req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query:req.body.room.ownerAddress,
        limit:1
    }).send()
    const room = new Room(req.body.room)
    room.geometry= geoData.body.features[0].geometry;
    room.roomImage = req.files.map(f =>({url: f.path, filename: f.filename}))
    room.author = req.user._id;
    await room.save()
    console.log(room)
    req.flash('success','Successfully made a new room');
     return res.redirect(`/rooms/${room._id}`)
}
module.exports.showRoom = async(req,res)=>{
    const foundRoom = await Room.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(! foundRoom){
        req.flash('error','Cannot find that campground')
        return res.redirect('/rooms')
    }
    res.render('room/show',{foundRoom})
}

module.exports.renderEditForm =  async(req,res)=>{
    const {id}= req.params
    const room = await Room.findById(id)
    if(!room){
        req.flash('error','Cannot find that campground')
        return res.redirect('/rooms')
    }
    res.render('room/edit', {room})
}
module.exports.updateRoom= async(req,res)=>{
    const {id} = req.params;
    // console.log(req.body)
    const room = await Room.findByIdAndUpdate(id,{...req.body.room})
    const imgs = req.files.map(f =>({url: f.path, filename: f.filename}))
    room.roomImage.push(...imgs);
    await room.save()
    if(req.body.deleteRoomImage){
        for(let filename of req.body.deleteRoomImage){
           await cloudinary.uploader.destroy(filename)
        }
        await room.updateOne({$pull: {roomImage:{filename:{$in: req.body.deleteRoomImage}}}})
        
    }
    console.log(req.body)
    req.flash('success','Successfully updated a room');
    res.redirect(`/rooms/${room._id}`)
}
module.exports.deleteRoom =  async(req,res)=>{
    await Room.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted a room')
    res.redirect('/rooms')
}