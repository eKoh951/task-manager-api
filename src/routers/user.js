const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
// ES6 Destructuring
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../emails/account')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
				sendWelcomeEmail(user.email, user.name)
        // User gets saved within the generateAuthToken method
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    }
    catch (error) {
        res.status(400).send(error)
    }

    // // Using Promises
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     // Status 400 = Error: Bad request
    //     res.status(400).send(error)
    // })
})

// get all users
// by adding "auth" before the callback function, we can call a middleware function
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    // try {
    //     // By passing an empty object argument ({}) we mean that we are selecting all the data
    //     users = await User.find({})
    //     res.send(users)
    // }
    // catch (error) {
    //     res.status(500).send(error)
    // }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // res.send({ user: user.getPublicProfile(), token })
        res.send({user, token})
    }
    catch(error) {
        res.status(400).send('nope')
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            // req.token comes from auth middleware, req.user comes aswell
            return token.token !== req.token
        })
        await req.user.save()
        
        res.send('User logged out')
    }
    catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        // Wipe all tokens
        req.user.tokens = []
        await req.user.save()
        res.send('All tokens wiped')
    }
    catch (error) {
        res.status(500).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    // Object.keys method, converts the JSON to an array of strings
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    // every is a method for arrays, it returns true if the array passes a "test"
    //    (update) at the beginning is how we access each variable within the array of "updates"
    //    then, each variable is being "tested" against allowedUpdates
    //    allowedUpdates.includes(update) checks if the current update, includes an allowedUpdate
    //    if this is true for all updates, then it returns true, but if this is false even for 1 only update
    //    it returns false
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if(!isValidOperation) return res.status(400).send({ error:'Invalid update!' })

    try {
        // const user = await User.findById(req.params.id)
        user = req.user

        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        // FindByIdAndUpdate bypasses the middleware
        // new: true, if true, then returns the Updated document, if false, return the old document
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // if(!user) return res.status(404).send()
        res.send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user) return res.status(404).send()
        const user = req.user
				await user.remove()
				sendGoodbyeEmail(user.email, user.name)
        res.send(user)
    }
    catch (error) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        // Size in bytes
        fileSize: 1 * 1024 * 1024
    },
    fileFilter(req, file, cb){
        const regex = /\.(jpg|jpeg|png)$/
        if(!file.originalname.match(regex)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
	const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

	// Storing the avatar to the user
	req.user.avatar = buffer

	await req.user.save()
	res.send()
}, (error, req, res, next) => {
    res.status(500).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async(req,res) => {
		req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar){
            throw new Error() 
        }

        // We are telling to the browser that we are going to respond
        //   with an image type of subtype jpg (Defining the Media Type)
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

// // get user by id using :id to specify a route parameter: parts of a url to capture dynamic values
// //   note: :id is choosen by us
// router.get('/users/:id', async (req, res) => {
//     // This contains all the params for the route paramenter
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         if(!user) return res.status(404).send('User does not exist')
//         res.send(user)
//     }
//     catch (error){
//         res.status(500).send(error)
//     }
// })

module.exports = router