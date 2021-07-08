const express = require('express')
const { required } = require('joi')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const users  = require('../controllers/users')

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), catchAsync(users.login))

router.get('/logout', users.logout)

module.exports = router;