module.exports = (sequelize, Sequelize) => {
    const treinoStatus = sequelize.define("treino_status", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        data: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.BOOLEAN
        },
        dSemana: {
            type: Sequelize.STRING,
        },
        grupoMuscular: {
            type: Sequelize.STRING
        },
        gastoCalorico: {
            type: Sequelize.INTEGER
        },
        duracao:{
            type: Sequelize.INTEGER
        }
    });
    return treinoStatus;
};