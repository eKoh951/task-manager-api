const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const log = console.log

// Create an express application
const app =  express()
const port = process.env.PORT || 3000

const multer = require('multer')
const upload = multer({
	dest: 'images/',
	limits: {
			fileSize: 1 * 1024 * 1024
	},
	fileFilter(req, file, cb){
		const regex = /\.(doc|docx)$/
		if(!file.originalname.match(regex)){
			return cb(new Error('Please upload a doc/x'))
		}
		cb(undefined, true)
		// cb(new Error('File must be a PDF'))
		// cb(un)
	}
})

app.post('/upload', upload.single('upload'), (req, res) => {
	res.send()
}, (error, req, res, next) => {
	res.status(400).send( { error: error.message} )
})

// Parses json data into object, so we are able to read it
app.use(express.json())
// These are the route handlers
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => log('Server is up on port: ' + port))