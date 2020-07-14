const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
// Why did we use new...?
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)  // Old solution: without task linked to an owner
    // This is to make a more readable code
    user = req.user

    const task = new Task({
        // ... is the ES6 spread operator, it copies all the properties of req.body to the object, so we can concatenate
        ...req.body,
        // Here is were we concatenate the owner info
        owner: user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(error) {
        res.status(404).send(error)
    }
})

// GET /tasks?completed=true
router.get('/tasks', auth, async (req, res) => {
    const match = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    try {
        //tasks = await Task.find({ owner: req.user._id })
        await req.user.populate({
            path: 'tasks',
            match
        }).execPopulate()
        res.send(req.user.tasks)
    }
    catch(error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const user = req.user
    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: user._id })
        if(!task)
            return res.status(404).send()
        res.send(task)
    }
    catch(error) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isAllowedUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isAllowedUpdate) return res.status(400).send('Invalid update!')
    
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if(!task) return res.status(404).send('Invalid task!')
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    }
    catch (error) {
        res.status(500).send('something fucked up')
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if(!task) return res.status(404).send('No task deleted')

        res.send(task)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router