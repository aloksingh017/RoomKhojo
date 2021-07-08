const express = require('express')
const router = express.Router();
const Room = require('../models/rooms')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const {isLoggedIn,isAuthor,validateRoom} = require('../middleware')
const user = require('../models/user')
const Review = require('../models/review')
const rooms  = require('../controllers/room')
const multer = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({storage});

router.route('/')
    .get(catchAsync(rooms.index))
    .post( isLoggedIn,upload.array('roomImage'),validateRoom,catchAsync(rooms.createRoom))


router.get('/new',isLoggedIn,rooms.renderNewForm)

router.route('/:id')
    .get(catchAsync(rooms.showRoom))
    .put(isLoggedIn,isAuthor,upload.array('roomImage'),validateRoom,catchAsync(rooms.updateRoom))
    .delete(isLoggedIn,isAuthor,catchAsync(rooms.delteRoom))
    
 router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(rooms.renderEditForm))

module.exports = router;