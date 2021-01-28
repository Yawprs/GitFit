const { default: axios } = require('axios')
const express = require('express')
const router = express.Router()
const db = require('../models')

router.post('/', (req, res) => {
    console.log(req.body)
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
        res.render('apiShow', {apiData : apiData.data, apiId: req.params.apiId})
    }).catch(err => {console.log(err)})
})

router.delete('/profile/:id/show', (req, res) => {
    db.user.findByPk(req.user.id)
    .then(user => {
        db.workout.findOne({
            where: {
                id: req.params.id
            }
        }).then(workout => {
            console.log(workout)
            user.removeWorkout(workout)
            res.redirect('/profile')
        })
    })
})

module.exports = router

// .catch(err => {console.log(err)})