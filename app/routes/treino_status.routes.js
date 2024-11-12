const controllerStatus = require('../controllers/treino_status.controller');
const { authJwt } = require('../middleware');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/status", [authJwt.verifyToken], controllerStatus.createStatus);
    app.get("/status", [authJwt.verifyToken], controllerStatus.userStatus);
    app.get("/checkTreinoStatus", [authJwt.verifyToken], controllerStatus.checkTreinoStatus);
    app.get("/statusInfo", [authJwt.verifyToken], controllerStatus.getStatusInfo);
    app.get("/getStatusInfo", [authJwt.verifyToken], controllerStatus.getStatusDuracao);
    app.get("/semanaAtual", [authJwt.verifyToken], controllerStatus.getTreinosSemanaAtual);
}