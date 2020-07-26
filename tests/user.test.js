const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const userOne = {
	name: 'Gemma',
	email: 'gordis@porahi.com',
	password: 'miau123'
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
	await request(app).post('/users').send({
		name: 'Erick',
		email: 'erick@example.com',
		password: 'bokunopassdesuwu!'
	}).expect(201)
})

test('Should login existing user', async () => {
	await request(app).post('/users/login').send({
		email: userOne.email,
		password: userOne.password
	}).expect(200)
})

test('Should not login nonexistent user', async () => {
	await request(app).post('/users/login').send({
		email: 'asdf@example.com',
		password: 'asdf1234'
	}).expect(400)
})