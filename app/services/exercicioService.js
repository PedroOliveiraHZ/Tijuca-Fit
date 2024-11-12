const {
    createExercicio,
    findAllExercicios,
    findExercicioById,
  } = require('../repositories/exercicioRepository');
  
  const addExercicio = async (exercicioData) => {
    return await createExercicio(exercicioData);
  };
  
  const getAllExercicios = async () => {
    return await findAllExercicios();
  };
  
  const getExercicioByIdOrName = async (id) => {
    const exercicio = await findExercicioById(id);
    if (!exercicio) {
      throw new Error('Exercício não encontrado.');
    }
    return exercicio;
  };
  
  module.exports = {
    addExercicio,
    getAllExercicios,
    getExercicioByIdOrName,
  };
  