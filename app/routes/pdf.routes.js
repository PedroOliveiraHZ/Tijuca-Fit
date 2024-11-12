const { authJwt } = require('../middleware');
const pdfController = require('../controllers/pdf.controller.js');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/pdf", [authJwt.verifyToken], pdfController.generateAndFetchPdf);
}; 
