const mongoose = require('mongoose');
const request = require('supertest');
const Quiz = require('../db/models/quiz');
const app = require('../index');
require('custom-env').env('staging');

beforeAll(async () => {
    await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/getallquiz`);
});

beforeEach(async () => {
    await Quiz.deleteMany({});
})

test('get all quizzes', async () => {
    await request(app).post("/quiz").set('token', 'x').send({
        name: "quiz one",
        questions: []
    });
    const res = await request(app).get("/quiz").expect(200).expect('Content-type', /json/);
    expect(res.body).toEqual([{
        name: "quiz one",
        _id: res.body[0]._id
    }]);
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
})