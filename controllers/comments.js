const { default: axios } = require('axios')
const express = require('express')
const router = express.Router()
const db = require('../models')

router.post('/:id', (req,res) => {
    console.log(req.user)
    db.comment.create({
        content: req.body.content,
        workoutId: req.params.id,
        userId: req.user.id
    }).then(comment => {
          res.redirect(`/profile/${req.params.id}/show`)
    })
})

// DELETE route for comments 
router.delete('/:workoutId/:commentId' , (req, res) => {
    // console.log("route hit")
    db.comment.destroy({
        where: {
            id: req.params.commentId
        }
    }).then(deleted => {
        res.redirect(`/profile/${req.params.workoutId}/show`)
    })
})

router.get('/:workoutId/:commentId', (req,res) => {
    db.comment.findOne({
        where: {
            id: req.params.commentId
        }
    }).then(comment => {
        res.render('edit', {comment, workoutId: req.params.workoutId})
    })
})

// PUT route for comments
router.put('/:workoutId/:commentId', (req, res) => {
    console.log('route hit')
    db.comment.update({
        content: req.body.edit
    },{
        where: {
            id: req.params.commentId
        }
    }).then(updated => {
        res.redirect(`/profile/${req.params.workoutId}/show`)
    })
})

module.exports = router