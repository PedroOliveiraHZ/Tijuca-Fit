const constrollerRecordes = require('../controllers/recordesController');
const {authJwt} = require('../middleware');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/recordes", [authJwt.verifyToken], constrollerRecordes.createRecorde);
    app.get("/recordes/:userId/:exercicioId", [authJwt.verifyToken], constrollerRecordes.getRecordes);
}