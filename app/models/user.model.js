// const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {

    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    caminho:{
      type: Sequelize.STRING
    },
    cpf:{
      type: Sequelize.STRING
    },
    telefone:{
      type: Sequelize.STRING
    },
    nome_da_imagem:{
      type: Sequelize.STRING
    },
    formShown:{
      type: Sequelize.STRING
    }
  });

  return User;
};
