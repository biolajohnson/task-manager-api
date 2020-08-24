
const request = require('supertest')
const Tasks = require('../src/models/tasks')
const app = require('../src/app')
const { setupDatabase, userOneId, userOne, taskTwo, userTwo } = require('./fixtures/db')


beforeEach(setupDatabase)

test('Should create a task', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'make the bed'
        }).expect(201)
})

test('Should read tasks', async () => {
   const response =  await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        const tasks = await Tasks.find({})
        expect(response.body.length).toBe(2)
})

test('Unauthorized users should not delete tasks', async () => {
    const response = await request(app)
        .delete('/tasks/' + taskTwo._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
       const task = await Tasks.findById(taskTwo._id)
        expect(task).not.toBeNull()
})