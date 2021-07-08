const Review = require('../models/review')
const Room = require('../models/rooms')

module.exports.createReview = async(req,res)=>{
    const room = await Room.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    room.reviews.push(review);
    await review.save()
    await room.save()
    req.flash('success', 'Successfully added a review')
    res.redirect(`/rooms/${room._id}`)
}

module.exports.deleteReview = async (req,res)=>{
    const {id, reviewId}= req.params;
    await Room.findByIdAndUpdate(id, { $pull : { reviews:reviewId }})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted a review')
    res.redirect(`/rooms/${id}`);
}