const mongoose = require('mongoose')
const validator = require('validator')

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

// const newTask = new Task({
//     description: '   Finish NodeJS course',
//     completed: false
// })

// // Promises
// newTask.save().then(() => {
//     log(newTask)
// }).catch((error) => {
//     log(error)
// })

module.exports = Task