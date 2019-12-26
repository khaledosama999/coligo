const mongoose = require("mongoose");
const request = require("supertest");
const Quiz = require("../db/models/quiz");
const app = require("../index");
require("custom-env").env("staging");

beforeAll(async () => {
  await mongoose.connect(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/createquestion`
  );
});

beforeEach(async () => {
  await Quiz.deleteMany({});
});

test("create a question without given the quiz id", async () => {
  await request(app)
    .post("/quiz").set('token', 'x')
    .send({
      name: "quiz 1"
    });
  await request(app)
    .put("/quiz").set('token', 'x')
    .send({
      body: "question 1",
      type: "text",
      answer: "1231"
    })
    .expect(404);
});

test("create a valid question  given the quiz id", async () => {
  await request(app)
    .post("/quiz").set('token', 'x')
    .send({
      name: "quiz 1"
    });
  const res = await request(app)
    .get("/quiz/getquiz")
    .send({
      name: "quiz 1"
    });
  await request(app)
    .put(`/quiz/${res.body._id}`).set('token', 'x')
    .send({
      body: "question 1",
      type: "text",
      answer: "1231"
    })
    .expect(200);
  const quiz = await request(app)
    .get("/quiz/getquiz")
    .send({
      name: "quiz 1"
    });
  console.log(quiz.body.questions[0]);
  expect(quiz.body.questions[0]).toEqual({
    _id: quiz.body.questions[0]._id,
    body: "question 1",
    type: "text",
    answer: "1231",
    choices: []
  });
});

test("create a question without the body given the quiz id", async () => {
  await request(app)
    .post("/quiz").set('token', 'x')
    .send({
      name: "quiz 1"
    });
  const res = await request(app)
    .get("/quiz/getquiz")
    .send({
      name: "quiz 1"
    });
  const res2 = await request(app)
    .put(`/quiz/${res.body._id}`).set('token', 'x')
    .send({
      type: "text",
      answer: "1231"
    })
    .expect(422);
});

test("create a question without the type given the quiz id", async () => {
  await request(app)
    .post("/quiz").set('token', 'x')
    .send({
      name: "quiz 1"
    });
  const res = await request(app)
    .get("/quiz/getquiz")
    .send({
      name: "quiz 1"
    });
  const res2 = await request(app)
    .put(`/quiz/${res.body._id}`).set('token', 'x')
    .send({
      body: "question 1",
      answer: "1231"
    })
    .expect(422);
});

test("create a question without the answer given the quiz id", async () => {
  await request(app)
    .post("/quiz").set('token', 'x')
    .send({
      name: "quiz 1"
    });
  const res = await request(app)
    .get("/quiz/getquiz")
    .send({
      name: "quiz 1"
    });
  const res2 = await request(app)
    .put(`/quiz/${res.body._id}`).set('token', 'x')
    .send({
      type: "text",
      body: "1231"
    })
    .expect(422);
});

test("create a question without the answer given the quiz id", async () => {
  await request(app)
    .post("/quiz").set('token', 'x')
    .send({
      name: "quiz 1"
    });
  const res = await request(app)
    .get("/quiz/getquiz")
    .send({
      name: "quiz 1"
    });
  const res2 = await request(app)
    .put(`/quiz/${res.body._id}`).set('token', 'x')
    .send({
      type: "text",
      body: "1231"
    })
    .expect(422);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});