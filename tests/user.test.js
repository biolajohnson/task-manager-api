const request = require('supertest')
const app = require('../src/app')
const { setupDatabase, userOne, userOneId } = require('./fixtures/db')
const User = require('../src/models/users')



beforeEach(setupDatabase)

test('Should create new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Sam Well',
        email: 'samwell@mail.com',
        password: 'biola4ever!'
    }).expect(201)
    const user = await User.findById(response.body.user._id)
    expect(user.password).not.toBe('biola4ever!')

    expect(response.body).toMatchObject({
        user: {
            name: 'Sam Well',
        },
        token: user.tokens[0].token
    })
})

test('Should login user', async () => {
     const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
        
})

test('Should not login in user', async () => {
    await request(app).post('/users/login').send({
        email: 'nonone@example.com',
        password: 'tyyghdjdn'
    }).expect(400)
})

test('Should show profile page', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send()
        .expect(200)
})

test('Should not show unauthorized profile page', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete user', async () => {
       await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
    const user = await User.findById(userOneId)
     expect(user).toBeNull()
})
test('Should not delete unauthorized user', async () => {
        await request(app)
            .delete('/users/me')
            .send()
            .expect(401)
})

test('Should upload avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}` )
        .expect(200)
})

test('Should update valid user fields', async () => {
            await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Abiola Johnson'
        })
        .expect(200)
        const user = await User.findById(userOneId)
        expect(user.name).toEqual('Abiola Johnson')
})

test('Should not update invalid user fields', async () => {
        await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Paris'
        })
        .expect(404)
})
