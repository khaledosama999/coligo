const mongoose = require('mongoose');
const request = require('supertest');
const Quiz = require('../db/models/quiz');
const app = require('../index');
require('custom-env').env('staging');

beforeAll(async () => {
    await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/getquiz`);
});

beforeEach(async () => {
    await Quiz.deleteMany({});
})

test('get a quiz given its name', async () => {
    await request(app).post("/quiz").set('token', 'x').send({
        name: "quiz one",
        questions: []
    });
    await request(app).post("/quiz").set('token', 'x').send({
        name: "quiz two",
        questions: []
    });
    const res = await request(app).get("/quiz/getquiz").send({
        name: "quiz two"
    }).expect(200).expect('Content-type', /json/);
    expect(res.body).toEqual({
        name: "quiz two",
        questions: [],
        __v: res.body.__v,
        _id: res.body._id
    });
});

test('get null given no name for a quiz', async () => {
    await request(app).post("/quiz").set('token', 'x').send({
        name: "quiz one",
        questions: []
    });
    await request(app).post("/quiz").set('token', 'x').send({
        name: "quiz two",
        questions: []
    });
    const res = await request(app).get("/quiz/getquiz").send({}).expect(422).expect('Content-type', /json/);
});



afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
})