const Joi = require('joi')

module.exports.roomSchema = Joi.object({
    room:Joi.object({
       ownerName:Joi.string().required(),
       ownerAddress:Joi.string(),
       ownerPhone:Joi.number().required(),
       ownerImage:Joi.string().required(),
    //    roomImage:Joi.string().required(),
       price:Joi.number().required().min(0),
       seater:Joi.number().required().min(0),
    }).required(),
    deleteRoomImage:Joi.array()

})

module.exports.reviewSchema = Joi.object({
    review :Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body:Joi.string().required()
    }).required()
})