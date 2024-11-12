// module.exports = (sequelize, Sequelize) => {
//   const Imc = sequelize.define("relatorio_user", {
//     id: {
//       type: Sequelize.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     peso: {
//       type: Sequelize.DECIMAL(5,2)
//     },
//     altura: {
//       type: Sequelize.DECIMAL(5,2)
//     },
//     peso_meta: {
//       type: Sequelize.DECIMAL(5,2)
//     },
//     nome_meses: {
//       type: Sequelize.STRING,
//       defaultValue: 0 
//     },
//     genero:{
//       type: Sequelize.STRING
//     },
//     imc:{
//       type: Sequelize.FLOAT
//     },
//     status_obesidade:{
//       type: Sequelize.STRING
//     }
//   });

//   return Imc;
// };
module.exports = (sequelize, Sequelize) => {
  const Imc = sequelize.define("relatorio_user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    peso: {
      type: Sequelize.DECIMAL(5,2)
    },
    altura: {
      type: Sequelize.DECIMAL(5,0)
    },
    pesoMeta: {
      type: Sequelize.DECIMAL(5,2)
    },
    nome_meses: {
      type: Sequelize.STRING,
      defaultValue: 0 
    },
    genero: {
      type: Sequelize.STRING
    },
    objetivo: {
      type: Sequelize.STRING
    },
    imc: {
      type: Sequelize.DECIMAL(5,2)
    },
    status_obesidade: {
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users', // Nome da tabela referenciada
        key: 'id'      // Nome da chave primária na tabela referenciada
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }
  });

  return Imc;
};
