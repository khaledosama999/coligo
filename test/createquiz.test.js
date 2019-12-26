const mongoose = require('mongoose');
const request = require('supertest');
const Quiz = require('../db/models/quiz');
const app = require('../index');
require('custom-env').env('staging');

beforeAll(async () => {
    await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/createquiz`);
});

beforeEach(async () => {
    await Quiz.deleteMany({});
})

test('create a quiz given its name', async () => {
    const res = await request(app).post('/quiz').set('token', 'x').send({
        "name": "quiz one",
    }).expect(200);
    console.log(res.body);
    expect(res.body).toEqual({
        "msg": "quiz was created successfully"
    })
});

test('create a quiz not given its name', async () => {
    const res = await request(app).post('/quiz').set('token', 'x').send({}).expect(422);
});




afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
})