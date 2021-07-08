const express = require('express')
const router = express.Router({mergeParams:true});
const Room = require('../models/rooms')
const Review = require('../models/review')
const {reviewSchema} = require('../schema.js')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const {isLoggedIn,validateReview,isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/review')

router.post('/', isLoggedIn,validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;