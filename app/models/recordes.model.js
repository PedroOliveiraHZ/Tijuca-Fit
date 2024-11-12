module.exports = (sequelize, Sequelize) => {
  const Recordes = sequelize.define("recordes", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    carga: {
      type: Sequelize.FLOAT,
      allowNull: false,
    }
  });

  return Recordes;
};
