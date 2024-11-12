// const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Verificacao = sequelize.define("codigo-verific", {
    email: {
      type: Sequelize.STRING
    },
    codigo:{
      type: Sequelize.STRING
    },
    expiresAt:{
      type: Sequelize.DATE
    }
  });

  return Verificacao;
};
