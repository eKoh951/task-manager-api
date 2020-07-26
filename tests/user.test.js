const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

// Creating a new ObjectId
const userOneId = new mongoose.Types.ObjectId()

const userOne = {
	_id: userOneId,
	name: 'Gemma',
	email: 'gordis@porahi.com',
	password: 'miau123',
	tokens: [{
		token: jwt.sign({ _id: userOneId}, process.env.TOKEN_SECRET_WORD)
	}]
}

// Global function
// Runs just before every test
beforeEach(async () => {
	//Delete all users
	await User.deleteMany()
	await new User(userOne).save()
})

// test function comes from Jest
test('Should signup a new user', async () => {
	// request function comes from Supertest
	const response = await request(app).post('/users').send({
		name: 'Erick',
		email: 'erick@example.com',
		password: 'bokunopassdesuwu!'
	}).expect(201)

	// Assert that the user was actually saved to the database
 	// Mongoose:
	const user = await User.findById(response.body.user._id)
	// Jest: Using .not property to expect the opposite to be Null
	expect(user).not.toBeNull()

	// Assertions about the response body
	expect(response.body).toMatchObject({
		 user: {
			 name: 'Erick',
			 email: 'erick@example.com'
		 },
		 token: user.tokens[0].token
	})

	// Assert that the password is not saved in plain text
	expect(user.password).not.toBe('bokunopassdesuwu!')
})

test('Should login existing user', async () => {
	const response = await request(app).post('/users/login').send({
		email: userOne.email,
		password: userOne.password
	}).expect(200)

	// Fetch user from database
	const user = await User.findById(userOneId)
	// Validade that the user exists
	expect(user).not.toBeNull()
	// Assert that token in response matches user's 2nd token
	expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not login nonexistent user', async () => {
	await request(app).post('/users/login').send({
		email: 'asdf@example.com',
		password: 'asdf1234'
	}).expect(400)
})

test('Should get profile picture', async () =>{
	await request(app)
		.get('/users/me')
		// .set is used to set a header (key, value)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
	await request(app)
		.get('/users/me')
		.send()
		.expect(401)
})

test('Should delete account for user', async () => {
	const response = await request(app)
		.delete('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)

	//Validate user is removed
	const user = await User.findById(userOneId)
	expect(user).toBeNull
})

test('Should not delete account for unauthenticated user', async () => {
	await request(app)
		.delete('/users/me')
		.send()
		.expect(401)
})