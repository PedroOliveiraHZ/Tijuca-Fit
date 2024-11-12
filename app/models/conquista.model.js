module.exports = (sequelize, Sequelize) => {
  const Conquista = sequelize.define("conquistas", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    caminho:{
      type: Sequelize.STRING
    },
    imagem_da_conquista:{
      type: Sequelize.STRING
    },
    nome: {
      type: Sequelize.STRING
    },
    descricao: {
      type: Sequelize.STRING
    }
  });

  return Conquista;
};
