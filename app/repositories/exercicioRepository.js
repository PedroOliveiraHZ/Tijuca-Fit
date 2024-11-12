const db = require('../models');
const Exercicios = db.exercicio;

const createExercicio = async (exercicioData) => {
  return await Exercicios.create(exercicioData);
};

const findAllExercicios = async () => {
  return await Exercicios.findAll();
};

const findExercicioById = async (id) => {
  return await Exercicios.findByPk(id);
};

module.exports = {
  createExercicio,
  findAllExercicios,
  findExercicioById,
};
