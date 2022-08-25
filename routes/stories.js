const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Story')

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id // add a property of user with the user's id
        await Story.create(req.body) // once user has been created, the request body which contains user is sent to the database through the story model
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

//@desc Showw all public stories
//@Route GET /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        //creating a stories object to render
        const stories = await Story.find({ status: 'public' }) // finding all stories with status of public
            .populate('user') // displaying user data on card
            .sort({ createdAt: 'desc' }) // sorted from newest to oldest
            .lean() // converting from mongoose object and responding with JSON
        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// Exporting route
module.exports = router
