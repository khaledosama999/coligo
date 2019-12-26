const {
    body,
    param,
    validationResult,
} = require('express-validator');

const goToErrorMiddleware = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(errors.array());
    } else next();
}

const getQuizValidator = [
    body("name").exists().withMessage("the name of the quiz is required ").
    isString().withMessage("name must be a string").trim(),
    goToErrorMiddleware
];

const questionValidation = (prefix = '') => [
    body(`${prefix}body`).exists().withMessage("body of the question is required").
    isString().withMessage("body must be a string").trim(),
    body(`${prefix}type`).exists().withMessage("type of the question is required").
    isString().withMessage("type must be a string").
    isIn(['choice', 'checkbox', 'text']).withMessage("type must be one of these options {choice,checkbox,text}"),
    body(`${prefix}choices`).if(body(`${prefix}type`).not().equals('text')).
    isArray().withMessage('the choices for the question must be an array'),
    body(`${prefix}choices.*.letter`).if(body(`${prefix}choices`).exists()).exists().withMessage('choose a letter for the given answer').
    isString().withMessage("must be a string").isLength({
        max: 1,
        min: 1
    }).withMessage("length must be equal to one"),
    body(`${prefix}choices.*.body`).
    if(body(`${prefix}choices`).exists()).exists().withMessage('each choice needs a body').isString().withMessage('the choice body must be a string').trim(),
    body(`${prefix}choices`).
    if(body(`${prefix}choices`).exists()).
    custom((val) => {
        const letters = val.map((value) => value.letter);
        const lettersSet = new Set(letters);
        if (letters.length != lettersSet.size) {
            throw new Error("letters must be uniqe");
        }
        return true;
    }),
    body(`${prefix}answer`).if(body(`${prefix}type`).equals('text')).isString().withMessage("answer must be a string").trim(),
    body(`${prefix}answer`).if(body(`${prefix}type`).not().equals('text')).isArray().withMessage('answer must be an array if the question type is not text').isLength({
        min: 1
    }).withMessage("length of the answer array must be at least one").if(body(`${prefix}type`).equals('choice')).isLength({
        max: 1
    }).withMessage("question with type choice must contain one answer only"),
    body(`${prefix}answer.*`).if(body(`${prefix}answer`).isArray()).isString().isLength({
        min: 1,
        max: 1
    }).withMessage('correct answers must be a string of length 1').custom((letter, {
        req
    }) => {
        if (!req.body[`${prefix}choices`].find((val) => val.letter == letter)) {
            throw new Error("the correct answer must be part of the given choices");
        }
        return true;
    }),
    goToErrorMiddleware
];

const QuizParamId = [
    param('id').exists().withMessage("id of quiz is required").
    isString().withMessage('must be a string'),
    goToErrorMiddleware
]

const createQuizvalidator = [
    body('name').exists().withMessage("the quiz must have a name").
    isString().withMessage("the name of the quiz must be a string").trim(),
    body('questions').if(body('questions').exists()).isArray().withMessage("questions must be array"),
    ...questionValidation('questions.*.')
];

const deleteQuestion = [
    body("id").exists().withMessage('the id of the question is required').
    isString().withMessage("must be a string"),
    goToErrorMiddleware
];

module.exports = {
    deleteQuestion,
    QuizParamId,
    getQuizValidator,
    questionValidation,
    createQuizvalidator
}