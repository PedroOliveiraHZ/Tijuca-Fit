module.exports = (sequelize, Sequelize) => {
  const Conquista = sequelize.define("conquistas_usuarios", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    }
  });

  return Conquista;
};