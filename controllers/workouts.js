const { default: axios } = require('axios')
const express = require('express')
const router = express.Router()
const db = require('../models')

router.post('/', (req, res) => {
    db.workout.findOrCreate({
        where: {
            name: req.body.name,
            apiId: req.body.apiId
        }
    }).then(([workout, created]) => {
        req.user.addWorkout(workout)
        res.redirect('/profile')
    })
})

router.get('/api/:apiId', (req, res) => {
    console.log(process.env.API_KEY)
    axios.get(`https://wger.de/api/v2/exerciseinfo/${req.params.apiId}/?format=json`, {
        headers: { Authorization: process.env.API_KEY }
        })
    .then(apiData => {
        console.log(apiData.data)
        res.render('apiShow', {apiData : apiData.data})
    }).catch(err => {console.log(err)})
})

module.exports = router

// .catch(err => {console.log(err)})