module.exports = async (req, res, next) => {
    req.headers.token == 'x' ? next() : next({
        msg: "missing token"
    });
}