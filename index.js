require("custom-env").env();
require('./db/connections');
const express = require("express");
const app = express();

require('./config')(app);
require('./routes/config')(app);

if (require.main == module) {
    app.listen(process.env.APP_PORT, () => {
        console.log(`server is listening on port ${process.env.APP_PORT}`);
    });
}

module.exports = app;