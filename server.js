
require('dotenv').config() //configure environment variables
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn.js')
const axios = require('axios')

//set view engine to ejs
app.set('view engine', 'ejs')
app.use(ejsLayouts)

//bodyparser middleware allows us to receive form data in req.body
app.use(express.urlencoded({extended: false}))

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

//render home page
app.get('/', (req, res) => {
    res.render('searchPage')
})

// redirect to searchResults page when submitting search form
// app.post('/searchPage', (req, res) => {
//     res.redirect('/searchResults')
// })

//render profile page
app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs')
})

app.get('/searchResults', (req, res) => {
    axios.get(`https://wger.de/api/v2/exercise/?muscles=${req.query.search}`, {
        headers: {
        Authorization: process.env.API_KEY    
        }
    }).then(response => {

        console.log(response.data)
        res.render('searchResults')
    }).catch(err => {
        res.send(err)
    })
})

app.get('*', (req, res) => {
    res.render('404.ejs')
})

app.listen(process.env.PORT, () => {
    console.log(`We\'re fired up, baby! Listening on post ${process.env.PORT}`)
})