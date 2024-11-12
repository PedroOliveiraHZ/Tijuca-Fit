const { authJwt } = require("../middleware");
const controllerUser = require("../controllers/user.controller");
const controllerAdmin = require("../controllers/admin.controller");
const controllerModerator = require("../controllers/moderador.controller");
const controllerFrase = require('../controllers/frases.controller')
const { verify } = require("jsonwebtoken");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  
  
  //==== User ===//  
  // app.get("/api/test/all", controllerUser.allAccess);
  // app.get("/api/test/user", [authJwt.verifyToken], controllerAdmin.userBoard);
  app.put("/api/editUser/:id", [authJwt.verifyToken], controllerUser.updateUser);
  app.get("/api/user", [authJwt.verifyToken], controllerUser.userBoard);
  app.get("/api/frase", controllerFrase.frase)
  app.get('/api/users/:id', [authJwt.verifyToken], controllerUser.getUserById)

  //==== Mod ===//
  app.get("/api/mod", [authJwt.verifyToken, authJwt.isModerator], controllerModerator.moderatorBoard);

  //==== Admin ===//
  app.get("/api/admin/papeis/:id", [authJwt.verifyToken], controllerAdmin.papeis);
  app.get("/api/admin/allusers", [authJwt.verifyToken], controllerAdmin.Allusers);
  app.put("/api/admin/make-mod/:id", [authJwt.verifyToken, authJwt.isAdmin], controllerAdmin.makeUserMod);
  app.put("/api/admin/remove-mod/:id", [authJwt.verifyToken, authJwt.isAdmin], controllerAdmin.removeModRole);
  app.put("/api/admin/make-admin/:id", [authJwt.verifyToken, authJwt.isAdmin], controllerAdmin.makeUserAdmin);
  app.put("/api/admin/remove-admin/:id", [authJwt.verifyToken, authJwt.isAdmin], controllerAdmin.removeAdminRole);
  
};


