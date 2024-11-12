const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Admins = sequelize.define("admins", {

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

  return Admins;
};