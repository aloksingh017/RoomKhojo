const mongoose = require('mongoose')
const Room = require('../models/rooms')

mongoose.connect('mongodb://localhost:27017/room',{useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true})
const db= mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open',()=>{
    console.log('Database connected');
});

const seedDB = async()=>{
    await Room.deleteMany({});
    for(let i=0; i<10 ; i++){
        const room = new Room({
           address:{street:'Ram Gulam Tola', city:'Deoria',state:'UP',country:'India'},
           price:2000,
           owner:{ownername:'Alok Singh', phone:8090877128},
           roomCapacity:'2',
           additionalFeatures: 'Fan, Bulb, Bed is provided freely'
        })
        await room.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})


