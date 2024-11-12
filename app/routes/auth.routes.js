// const { verifySignUp } = require("../middleware");
// const controller = require("../controllers/auth.controller");

// module.exports = function(app) {
//   app.use(function(req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, Content-Type, Accept"
//     );
//     next();
//   });

//   app.post(
//     "/api/auth/signup",
//     [
//       verifySignUp.checkDuplicateUsernameOrEmail,
//       verifySignUp.checkRolesExisted
//     ],
//     controller.signup
//   );

//   app.post("/api/auth/signin", controller.signin);
//   app.post("/api/auth/signout", controller.signout);
//   app.get("/api/auth/checkemail", controller.duplicated);
//  };

// const express = require('express');
const { sendVerificationEmail, verifyCode,  } = require('../utils/emailService');
const controller = require("../controllers/auth.controller");
const { verifySignUp } = require("../middleware");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post('/manda-codigo', sendVerificationEmail);
  app.post('/verifica-codigo', verifyCode)
  // Rotas de autenticação existentes
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signout", controller.signout);
  app.get("/api/auth/checkemail", controller.duplicated);
}
// module.exports = app;
