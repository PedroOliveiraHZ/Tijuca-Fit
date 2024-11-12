const controllerFeedback = require('../controllers/feedbackController');
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers", 
    "Origin, Content-Type, Accept");
    next();
  });

  // Rota para enviar feedback com autenticação
  app.post("/feedback",[ authJwt.verifyToken], controllerFeedback.uploadFeedback);
}
