module.exports = (sequelize, Sequelize) => {
    const Exercicios = sequelize.define("exercicios", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        exercicio: {
            type: Sequelize.STRING,
        },
        caminho: {
            type: Sequelize.STRING,
        },
        nome_da_imagem: {
            type: Sequelize.STRING,
        },
        grupoMuscular: {
            type: Sequelize.STRING
        },
     
    });
    return Exercicios;
};