
require('dotenv').config() //configure environment variables
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn.js')
const axios = require('axios')
const db = require('./models/index.js')
const methodOverride = require('method-override')

//set view engine to ejs
app.set('view engine', 'ejs')
app.use(ejsLayouts)

//bodyparser middleware allows us to receive form data in req.body
app.use(express.urlencoded({extended: false}))

app.use(methodOverride("_method"))

// session middle
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

//flash middleware
app.use(flash())

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//CUSTOM MIDDLEWARE
app.use((req, res, next) => {
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next()
})

//controller middleware (auth controller)
app.use('/auth', require('./controllers/auth.js'))
app.use('/workouts', require('./controllers/workouts.js'))
app.use('/comments', require('./controllers/comments.js'))


// redirect to searchResults page when submitting search form
// app.post('/searchPage', (req, res) => {
//     res.redirect('/searchResults')
// })
       

app.get('/', (req, res) => {
    console.log('we hit the route')
    axios.get('https://wger.de/api/v2/exercise/?language=10&language=2', {
        headers: {
        Authorization: process.env.API_KEY    
        }
    }).then(response => {
        res.render('searchResults', {exercises: response.data.results})
    }).catch(err => {
        res.send(err)
    })
})

//render profile page
app.get('/profile', isLoggedIn, (req, res) => {
    db.user.findOne({
        where: {
            id: req.user.id
        }, include: [db.workout]
    }).then(user => {
        res.render('profile', {user})
    })
})

app.get('/profile/:id/show', (req, res) => {
    db.workout.findOne({
        where: {
            id: req.params.id
        }, include: [db.comment]
    }).then(workout => {
        axios.get(`https://wger.de/api/v2/exerciseinfo/${workout.apiId}/?format=json`, {
        headers: {
        Authorization: process.env.API_KEY    
        }
    }).then(info => {
        res.render('show', {workout, apiData: info.data})
        }).catch(err => {console.log(err)})
    })
})
       
app.get('*', (req, res) => {
    res.render('404.ejs')
})

app.listen(process.env.PORT, () => {
    console.log(`We\'re fired up, baby! Listening on post ${process.env.PORT}`)
})