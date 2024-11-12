const express = require('express');
const { initiatePasswordResetController, resetPasswordController, resetPasswordFormSubmitController } = require('../controllers/recuperar.controller');

module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });

    app.post('/mandaresetPassword', initiatePasswordResetController); //INICIO
    app.post('/reset-password/:token', resetPasswordFormSubmitController); //POSTA
    app.get('/reset-password/:token', resetPasswordController); //VERIFICAÇÃO PARA A PAGINA POST

};
