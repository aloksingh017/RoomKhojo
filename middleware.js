const {roomSchema,reviewSchema} = require('./schema')

const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const Room = require('./models/rooms')
const Review  = require('./models/review')

module.exports.isLoggedIn = (req,res,next)=>{
    if(! req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
    req.flash('error','You must be signed in First')
     return res.redirect('/login')
    }
    next();
}

module.exports.validateRoom = (req,res,next)=>{
    const {error} = roomSchema.validate(req.body);
    if(error){
        const msg = error.details.map( el => el.message).join(',')
        throw new ExpressError(msg,400)
    } else{
        next();
    }
}
module.exports.isAuthor = async (req,res,next)=>{
    const {id} = req.params;
    const room = await Room.findById(id)
    if(!room.author.equals(req.user._id)){
        req.flash('error','You are not an authorized user to do this!!!')
        return res.redirect(`/rooms/${id}`)
    }
    next();
}
module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You are not an authorized user to do this!!!')
        return res.redirect(`/rooms/${id}`)
    }
    next();
}
module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map( el => el.message).join(',')
        throw new ExpressError(msg,400)
    } else{
        next();
    }
}