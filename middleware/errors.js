module.exports = async (err, req, res, next) => {
    if (err.name == "MongoError") {
        res.status(422).json({
            "msg": err.errmsg
        });
    } else
        res.status(422).json(
            err
        );
}