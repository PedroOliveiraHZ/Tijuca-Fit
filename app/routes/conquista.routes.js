const  controllerConquista  = require('../controllers/criaConquista.controller')
const { authJwt } = require("../middleware/index.js");
const multer = require('multer')
const upload = require('../utils/uploadImg')

module.exports = function (app){
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/conquistas", [authJwt.verifyToken, authJwt.isAdmin], upload, controllerConquista.uploadConquista)
  app.get("/api/conquista",controllerConquista.verTodasAsConquistas)
  app.get("/api/suasConquistas", authJwt.verifyToken,controllerConquista.conquistaUser)
  app.get("/api/conquistas/:id", [authJwt.verifyToken], controllerConquista.conquistasById)

}