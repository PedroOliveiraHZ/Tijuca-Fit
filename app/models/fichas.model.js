module.exports = (sequelize, Sequelize) => {
  const Fichas = sequelize.define("fichas", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    alunoId:{
      type: Sequelize.INTEGER,
    },
    dSemana :{
      type: Sequelize.STRING
    },
    duracao: {
      type: Sequelize.INTEGER
    },
    gastoCalorico: {
      type: Sequelize.INTEGER
    },
    gMusc:{
      type: Sequelize.STRING
    }
  });

  return Fichas;
};