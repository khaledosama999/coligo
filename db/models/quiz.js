const mongoose = require('mongoose');
const QuestionSchema = require('./question');

const QuizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true
    },
    questions: {
        type: [QuestionSchema],
        default: []
    }
});

const Quiz = mongoose.model("quiz", QuizSchema);

module.exports = Quiz;