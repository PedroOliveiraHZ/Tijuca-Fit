const controllerTreinos = require('../controllers/treinos.controller.js');
const { authJwt } = require('../middleware');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/ficha", [authJwt.verifyToken, authJwt.isModeratorOrAdmin], controllerTreinos.mandaTreinos);
    app.get("/fichas", [authJwt.verifyToken], controllerTreinos.getTreinoByAlunoId); // É necessário adicionar "?alunoId='id de aluno desejado'" para realizar a query
    app.get("/getTreinos", [authJwt.verifyToken], controllerTreinos.getTreinos); // É necessário adicionar "?alunoId='id de aluno desejado'" para realizar a query
    app.get("/grupoMuscularTrabalhado", [authJwt.verifyToken], controllerTreinos.listaGrupoMuscular);
    
};