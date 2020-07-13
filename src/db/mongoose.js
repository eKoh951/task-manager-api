const mongoose = require('mongoose')
// 
const { errorMonitor } = require('stream')
const log = console.log

const connectionURL = 'mongodb://127.0.0.1:27017/'
const db = 'task-manager-api'

mongoose.connect(connectionURL + db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})