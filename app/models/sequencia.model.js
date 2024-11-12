module.exports = (sequelize, Sequelize) => {
  const Sequencia = sequelize.define("sequencia-dias", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dias: {
      type: Sequelize.INTEGER
    },
    
  });
  return Sequencia;
};
