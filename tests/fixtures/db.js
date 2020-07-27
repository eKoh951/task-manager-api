const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/Task')

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

const userTwoId = new mongoose.Types.ObjectId()

const userTwo = {
	_id: userTwoId,
	name: 'Andrew',
	email: 'andrew@example.com',
	password: 'bokunopass2',
	tokens: [{
		token: jwt.sign({ _id: userTwoId}, process.env.TOKEN_SECRET_WORD)
	}]
}

const taskOne = {
	_id: new mongoose.Types.ObjectId(),
	description: 'First task',
	completed: false,
	owner: userOneId
}

const taskTwo = {
	_id: new mongoose.Types.ObjectId(),
	description: 'Second task',
	completed: true,
	owner: userOneId
}

const taskThree = {
	_id: new mongoose.Types.ObjectId(),
	description: 'Third task',
	completed: true,
	owner: userTwoId
}

const setupDatabase = async () => {
	// Delete all users
	await User.deleteMany()
	await Task.deleteMany()
	// But create the test user
	await new User(userOne).save()
	await new User(userTwo).save()
	// Tasks
	await new Task(taskOne).save()
	await new Task(taskTwo).save()
	await new Task(taskThree).save()
}

module.exports = {
	userOneId,
	userTwoId,
	userOne,
	userTwo,
	taskOne,
	taskTwo,
	taskThree,
	setupDatabase
}