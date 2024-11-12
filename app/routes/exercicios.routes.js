const controllerExercicio = require('../controllers/exercicios.controllers.js');
const { authJwt } = require("../middleware");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });
    app.post("/exercicios", [authJwt.verifyToken, authJwt.isAdmin], controllerExercicio.addExercicio);
    app.get("/exercicios", [authJwt.verifyToken], controllerExercicio.getAllExercicios);
    app.get("/exercicio/:id", [authJwt.verifyToken, authJwt.isAdmin], controllerExercicio.getExercicioByIdOrName);
    app.get("/exercicios/:grupoMuscular", [authJwt.verifyToken], controllerExercicio.getExerciciosByGroup);

}
