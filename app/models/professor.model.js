const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Professor = sequelize.define("professores", {

    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    userId:{
      type: Sequelize.STRING
    },
    
  });

  return Professor;
};
