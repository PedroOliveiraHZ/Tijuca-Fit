const  controllerCalendario = require('../controllers/calendario.controller.js')
const { authJwt } = require("../middleware/index.js");

module.exports = function (app){
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/calendario",[authJwt.verifyToken], controllerCalendario.Calendario)
  

}