module.exports = (sequelize, Sequelize) => {
  const Treinos = sequelize.define("treinos", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    exercicio:{
      type: Sequelize.INTEGER
    },
    grupoMuscular:{
      type: Sequelize.STRING
    },
    series: {
      type: Sequelize.STRING,
    },
    reps: {
      type: Sequelize.STRING,
    }
  });
  return Treinos;
};
