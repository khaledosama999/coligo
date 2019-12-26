const Quiz = require('../db/models/quiz');


const getAllQuizzes = async (req, res, next) => {
    try {
        const quizes = await Quiz.find().select({
            name: true
        }).lean().exec();
        res.json(quizes);
    } catch (e) {
        next(e)
    }
}

const getQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            name: req.body.name
        }).lean().exec();
        res.json(quiz);
    } catch (e) {
        next(e);
    }
}

const createQuiz = async (req, res, next) => {
    try {
        const doc = new Quiz(req.body);
        await doc.save();
        res.json({
            "msg": "quiz was created successfully"
        });
    } catch (e) {
        next(e);
    }
}

const deleteQuestion = async (req, res, next) => {
    try {
        const doc = Quiz.findByIdAndUpdate(req.params.id, {
            $pull: {
                questions: {
                    _id: req.body.id
                }
            }
        }).lean().select({
            _id: true
        }).exec();
        res.json({
            "msg": "question was removed successfully"
        });
    } catch (e) {
        next(e);
    }
}

const addQuestion = async (req, res, next) => {
    try {
        const doc = await Quiz.findOneAndUpdate({
            _id: req.params.id,
        }, {
            $push: {
                questions: {
                    ...req.body
                }
            }
        }, {
            upsert: true
        }).lean().exec();
        res.json({
            "msg": "question was added successfully"
        });

    } catch (e) {
        next(e);
    }
}

module.exports = {
    getAllQuizzes,
    getQuiz,
    createQuiz,
    deleteQuestion,
    addQuestion
}