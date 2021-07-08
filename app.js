if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const {roomSchema, reviewSchema} = require('./schema.js')
const ExpressError = require('./utils/ExpressError')
const catchasync = require('./utils/catchAsync')
const roomsRoutes = require('./routes/rooms')
const reviewsRoutes = require('./routes/reviews')
const userRoutes = require('./routes/user')
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const { MongoStore } = require('connect-mongo')

const mongoDBStore = require('connect-mongo')(session);
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/room'
const secret = process.env.SECRET || 'thisisshouldbebettersecret'
mongoose.connect(dbUrl,{useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true,useFindAndModify:false})
const db= mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open',()=>{
    console.log('Database connected');
});

app.engine('ejs', ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
   
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize())

const store = new mongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24*60*60
})
store.on("error",function(e){
    console.log("SESSION STORE ERROR",e)
})
const sessionConfig = {
    store,
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now()+ 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error=req.flash('error');
    next()
})

app.use('/', userRoutes)
app.use('/rooms', roomsRoutes)
app.use('/rooms/:id/reviews',reviewsRoutes)

app.get('/',(req,res)=>{
    res.render('home')
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})
app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(! err.message) err.message ='Oh No, something went wrong'
    res.status(statusCode).render('error',{err});
})

app.listen(8080, ()=>{
    console.log('LISTENING ON PORT 8080')
})