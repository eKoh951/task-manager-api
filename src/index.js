const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const log = console.log

// Create an express application
const app =  express()
const port = process.env.PORT || 3000

// // Next when we are specifying an express middleware
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     }
//     else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Server is on maintenance, come back later, thank you!')
// })

// Parses json data into object, so we are able to read it
app.use(express.json())
// These are the route handlers
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => log('Server is up on port: ' + port))

const Task = require('./models/task')
const User = require('./models/user')

const main = async() => {
    // const task = await Task.findById('5f0b7680b7e405a4c0a4b9e2')
    // console.log(task)
    // console.log(task.owner)
    // // we want to populate the owner property from the task (task.owner)
    // // this currently has the reference, which is the user's ObjectID
    // // then after we have the reference set, we proceed to populate task.owner
    // // by triggering execPopulate(), then the User document is populated in task.owner
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    const user = await User.findById('5f0b73b2b403d55f5835149c')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

main()