const  controllerImc  = require('../utils/imc.js')
const { authJwt } = require("../middleware/index.js");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/imc", [authJwt.verifyToken], controllerImc.mandaImc);
  app.get("/objetivo", [authJwt.verifyToken], controllerImc.listaObjetivo);
  app.get("/alunosObjetivos/:categoriaTreino",[authJwt.verifyToken], controllerImc.listaObjetivoAlunos )
  app.post("/imcNovo", [authJwt.verifyToken], controllerImc.mandaImcOutraVez);
  app.get("/pegarImc", authJwt.verifyToken, controllerImc.pegaImc);
  app.get("/ultimo", authJwt.verifyToken, controllerImc.ultimo);


};
