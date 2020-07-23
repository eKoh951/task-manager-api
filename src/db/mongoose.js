const mongoose = require('mongoose')
// 
const { errorMonitor } = require('stream')
const log = console.log

const connectionURL = 'mongodb://127.0.0.1:27017/'
const db = 'task-manager-api'

mongoose.connect(process.env.DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})