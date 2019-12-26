const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    body: {
        type: String,
        maxlength: 250,
        required: true
    },
    type: {
        type: String,
        enum: ['choice', 'checkbox', 'text'],
        required: true,

    },
    choices: {
        type: [{
            letter: {
                type: String,
                validate: {
                    validator: (v) => /^[a-z]{1}$/i.test(v),
                    message: 'please choose an appropriate letter A-Z'
                }
            },
            body: {
                type: String,
                required: true,
                maxlength: 250
            }

        }]
    },
    answer: {
        required: true,
        type: mongoose.SchemaTypes.Mixed
    }
});

module.exports = QuestionSchema;