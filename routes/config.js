const quizRouter = require('./quiz');

module.exports = (app) => {
    app.use("/quiz", quizRouter);
}