const log = (req, res, next) => {
    console.log(req.method, ' | ', req.path, ' | ', req.body);
};

module.exports = log;