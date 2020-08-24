const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/users')
const Tasks = require('../../src/models/tasks')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'qwerty!12',
    tokens: [{
        token: jwt.sign({ _id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Anthony',
    email: 'tony@example.com',
    password: 'myhousekeeper!12',
    tokens: [{
        token: jwt.sign({ _id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completed: 'false',
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Task',
    completed: 'true',
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third Task',
    completed: 'false',
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Tasks.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Tasks(taskOne).save()
    await new Tasks(taskTwo).save()
    await new Tasks(taskThree).save()
}

module.exports = {
    setupDatabase,
    userOne,
    userOneId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree
}