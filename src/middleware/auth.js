const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req, res, next) => {
    try {
        // req.header('key') is a function that returns the string value of the desired key
        // replace is a string method that "replaces" something (1st arg) with something else (2nd arg)
        const token = req.header('Authorization').replace('Bearer ', '')
        // Validate token
        const decoded = jwt.verify(token, 'ilikemiriam')
        // console.log(token)
        // console.log(decoded)
        // Find the user id from the requester since _id property is embeded in the token
        //   then compare ('tokens.token': token) the requester's token to the tokens that this user has in the database
        const user = await User.findOne( { _id: decoded._id, 'tokens.token': token })
        
        if(!user) throw new Error()

        // This way, when logging out we can just logout the token linked to the device
        req.token = token
        // Give to the route handler, access to the user so the router doesn't have to fetch it again (saving resources)
        //   by adding the property user on req to store it
        req.user = user
        next()
    }
    catch (error) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}

module.exports = auth