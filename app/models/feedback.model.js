module.exports = (sequelize, Sequelize) => {
  const Feedback = sequelize.define("feedbacks", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    classificacao: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    comentario: {
      type: Sequelize.STRING,
      
    }
  });

  return Feedback;
}