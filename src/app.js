const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const log = console.log

// Create an express application
const app =  express()

// Parses json data into object, so we are able to read it
app.use(express.json())

// These are the route handlers
app.use(userRouter)
app.use(taskRouter)

module.exports = app 