const mongoose = require('mongoose');
const review = require('./review');
const {Schema} = mongoose;

const roomSchema = new Schema({
    ownerName:String,
    ownerImage:String,
    ownerAddress:String,
    ownerPhone:Number,
    ownerImage:String,
    roomImage:[
        {
            url:String,
            filename:String
        }
    ],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    seater:Number,
    price:Number,
    author:{
        type:Schema.Types.ObjectId, ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId, ref:'Review'
 
    }]
});

roomSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Room', roomSchema)