const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const log = console.log

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        // Setting up a validator with ES6 syntax
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    email: {
        type: String,
        index: true,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) throw new Error('Password cannot contain "password"');
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
// Specifying schema options that is an object
}, {
    timestamps: true
})

// Virtual Property: This is a relationship between 2 entities, in this case: user <--> tasks
// First argument is a virtual property, can be named as anything
userSchema.virtual('tasks', {
    // This is launching from User, so it will look for Task
    ref: 'Task',
    // The data that is used to reference from the other entity (User's id)
    localField: '_id',
    // Name of the field on the other entity that is using the reference
    foreignField: 'owner'
})

// The res.send method, ALWAYS triggers the toJSON method to stringify (JSON.stringify) the JS Object,
//   just before that (from this MiddleWare), we can manipulate the data (the "this" binding)
userSchema.methods.toJSON = function () {
    const user = this

    // Get only the raw data from the user, getting rid of the stuff like .save() method that
    //   mongoose modelling gives, so we can modify the data to send
    const userObject = user.toObject()

    // We delete the password and token information so we DO NOT COMPROMISE this sensitive data
    delete userObject.password
    delete userObject.tokens

		// We also don't want to response with the user's avatar data, so we DO NOT SLOW the json response
		//   experiment:
		//		with:			380 bytes
		//		without:	290 kilo bytes
    delete userObject.avatar

    return userObject
}

// methods: an instance method, accessible from an instance of a model: an object (e.g. when we create a unique user)
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN_SECRET_WORD)

    // .concat method on arrays, so we add new tokens but keeping the existing tokens
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// statics: a model method, accessible through the model User
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user)
        throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, user.password)

    // It's better to not provide a lot of information for credential issues
    //   this is for security reasons
    if(!isMatch)
        throw new Error('Unable to login')
    
    return user
}

// Middleware setup: Hash the password
// 1st argument is the name of the event we want the middleware to happen
// 2nd argument has to be a standard function since we are going to use "this" binding
userSchema.pre('save', async function (next) {
    // user = this, is to make the code more readable
    const user = this

    // returns true if the password for the user has been modified
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    // next() is used to tell the middleware that we are done, so it does not hang for ever
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

// Creating a constructor for User (we use first letter as uppercase as convention to constructor's name)
// Also, creating a model
const User = mongoose.model('User', userSchema)

module.exports = User