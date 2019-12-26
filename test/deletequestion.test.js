const mongoose = require('mongoose');
const request = require('supertest');
const Quiz = require('../db/models/quiz');
const app = require('../index');
require('custom-env').env('staging');

beforeAll(async () => {
    try {
        await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/deletequestion`);
    } catch (e) {
        console.log(e);
    }
});

beforeEach(async () => {
    await Quiz.deleteMany({});
})

test('deleteing a question without the quiz id', async () => {
    await request(app).post('/quiz').set('token', 'x').send({
        name: "quiz one",
        questions: [{
            body: "quesiton 1",
            type: "choice",
            answer: "a"
        }]
    });
    await request(app).delete("/quiz").set('token', 'x').expect(404);
});

test('deleteing a question with the quiz id and withou question id', async () => {
    await request(app).post('/quiz').set('token', 'x').send({
        "name": "quiz one",
        "questions": [{
            "body": "true",
            "type": "text",
            "answer": "a"
        }]
    }).expect(200);

    const quiz = await request(app).get("/quiz/getquiz").send({
        name: "quiz one"
    });
    console.log(quiz.body);
    await request(app).delete(`/quiz/${quiz.body._id}`).set('token', 'x').expect(422);
});

test('deleteing a question with the quiz id and question id', async () => {
    await request(app).post('/quiz').set('token', 'x').send({
        "name": "quiz one",
        "questions": [{
            "body": "true",
            "type": "text",
            "answer": "a"
        }, {
            "body": "true",
            "type": "text",
            "answer": "c"
        }]
    }).expect(200);

    let quiz = await request(app).get("/quiz/getquiz").send({
        name: "quiz one"
    });
    await request(app).delete(`/quiz/${quiz.body._id}`).set('token', 'x').send({
        id: quiz.body.questions[0]._id
    }).expect(200);
    quiz = await request(app).get("/quiz/getquiz").send({
        name: "quiz one"
    });
    expect(quiz.body.questions).toEqual([{
        _id: quiz.body.questions[0]._id,
        choices: [],
        "body": "true",
        "type": "text",
        "answer": "c"
    }]);
});



afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
})