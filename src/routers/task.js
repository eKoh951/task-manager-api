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

router.get('/tasks', async (req, res) => {
    tasks = await Task.find({})
    try {
        res.send(tasks)
    }
    catch(error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        task = await Task.findById(_id)
        if(!task)
            return res.status(404).send()
        res.send(task)
    }
    catch(error) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isAllowedUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isAllowedUpdate) return res.status(400).send('Invalid update!')
    
    try {
        const task = await Task.findById(req.params.id)

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        if(!task) return res.status(404).send('Invalid task!')

        res.send(task)
    }
    catch (error) {
        res.status(500).send('something fucked up')
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete(req.params.id)
        if(!task) return res.status(404).send('No task deleted')

        res.send(task)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router