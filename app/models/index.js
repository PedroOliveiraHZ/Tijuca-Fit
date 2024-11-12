const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.imc = require("./imc.modal.js")(sequelize, Sequelize);
db.feedback = require("./feedback.model.js")(sequelize, Sequelize);
db.conquista = require("./conquista.model.js")(sequelize, Sequelize);
db.conquistaUser = require("./conquistaUser.model.js")(sequelize, Sequelize);
db.treinos = require("./treinos.model.js")(sequelize, Sequelize);
db.fichas = require("./fichas.model.js")(sequelize, Sequelize);
db.sequencia = require("./sequencia.model.js")(sequelize, Sequelize);
db.exercicio = require("./exercicios.model.js")(sequelize, Sequelize);
db.status = require("./treino_status.model.js")(sequelize, Sequelize);
db.recordes = require("./recordes.model.js")(sequelize, Sequelize);
db.professores = require('./professor.model.js')(sequelize, Sequelize);
db.admins = require('./admin.model.js')(sequelize, Sequelize);
db.verificacao = require('./verificacao.model.js')(sequelize, Sequelize);


db.sequencia.belongsTo(db.user, {
  foreignKey: "userId"
})
db.recordes.belongsTo(db.user, {
  foreignKey: 'userId'
});
db.recordes.belongsTo(db.exercicio, {
  foreignKey: 'exercicioId'
})
db.status.belongsTo(db.user, {
  foreignKey: "userId",
});
db.treinos.belongsTo(db.fichas, {
  foreignKey: "fichaId",
});
db.fichas.hasMany(db.treinos, {
  foreignKey: "fichaId",
});

db.imc.belongsTo(db.user, {
  foreignKey: "userId",
});
db.feedback.belongsTo(db.user, {
  foreignKey: "userId",
});
db.conquista.belongsTo(db.user, {
  foreignKey: "userId",
});
db.fichas.belongsTo(db.user,{ 
  foreignKey: "alunoId",
})
db.fichas.belongsTo(db.user, {
  foreignKey: "userId",
})
db.recordes.belongsTo(db.exercicio, {
  foreignKey: 'exercicioId'
})
db.user.hasMany(db.imc, {
  foreignKey: 'userId',
  as: 'imcs'
});

db.exercicio.belongsTo(db.user, {
  foreignKey: "userId",
});
db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});
db.conquistaUser.belongsTo(db.user, {
  foreignKey: 'userId'
});
db.conquistaUser.belongsTo(db.conquista,
  {
    foreignKey: 'conquistaId'
  });
db.recordes.belongsTo(db.user, {
  foreignKey: 'userId'
});

async function createConquistas() {
  try {
    await db.conquista.bulkCreate([
      { id: 59, nome: "1 Ano de Treino", descricao: "Complete 1 ano de treino", caminho: "http://192.168.10.204:8080/conquistas/1Ano.svg" },
      { id: 58, nome: "1 Mês de treino", descricao: "Complete seu primeiro mês de treino", caminho: "http://192.168.10.204:8080/conquistas/1Mes.svg" },
      { id: 56, nome: "2 Semanas de Treino", descricao: "Complete 2 semanas de treino", caminho: "http://192.168.10.204:8080/conquistas/2Semanas.svg" },
      { id: 57, nome: "1 Semana de Treino", descricao: "Complete 1 semana de treino", caminho: "http://192.168.10.204:8080/conquistas/1Semana.svg" },
      { id: 49, nome: "-10Kg", descricao: "Perca 10Kg", caminho: "http://192.168.10.204:8080/conquistas/perca10Kg.svg" },
      { id: 50, nome: "-5Kg", descricao: "Perca 5Kg", caminho: "http://192.168.10.204:8080/conquistas/perca5Kg.svg" },
      { id: 48, nome: "Sua opnião importa", descricao: "Envie 3 feedbacks", caminho: "http://192.168.10.204:8080/conquistas/3Feedbacks.svg" },
      { id: 53, nome: "Pronto para voar!", descricao: "Complete um treino de Costas", caminho: "http://192.168.10.204:8080/conquistas/diaDeCostas.svg" },
      { id: 52, nome: "Pernas torneadas", descricao: "Complete um treino de Pernas", caminho: "http://192.168.10.204:8080/conquistas/diaDePernas.svg" },
      { id: 64, nome: "Não morra na praia", descricao: "Pare de treinar por um mês", caminho: "http://192.168.10.204:8080/conquistas/obesa.svg" }
    ])
  } catch (error) {

  }
}
createConquistas()
async function createRoles() {
  try {
    // Criando os registros
    await db.role.bulkCreate([
      { id: 1, name: "user" },
      { id: 2, name: "moderator" },
      { id: 3, name: "admin" }
    ]);
    console.log("Registros de roles criados com sucesso!");
  } catch (error) {
    console.error("Erro ao criar registros de roles:", error);
  }
}

// Chamando a função para criar os registros
createRoles();
async function atualizarStatus() {
  try {
    await db.status.update(
      {
        grupoMuscular: db.Sequelize.col('grupoMuscular'),
        gastoCalorico: db.Sequelize.col('gastoCalorico'),
        duracao: db.Sequelize.col('duracao'),
      },
      {
        where: { status: true },
        include: [{ model: db.treinos, required: true, attributes: [] }] // Faz um INNER JOIN com a tabela treinos
      }
    );
    console.log('Status atualizados com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
  }
}

// Chame a função para atualizar os status
atualizarStatus();
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
