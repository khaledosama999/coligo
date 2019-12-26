const mongoose = require('mongoose');
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("connected to database server succesfully!");
    }
});

module.exports = mongoose;