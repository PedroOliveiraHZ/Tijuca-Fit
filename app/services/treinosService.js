const { createTreino, createFicha } = require('../repositories/treinoRepository');
const db = require("../models");
const User = db.user;
const Exercicio = db.exercicio
exports.uploadTreinos = async (treinoData) => {
  try {
    const treinos = await createTreino({
      userId: treinoData.userId,
      exercicio: treinoData.exercicio,
      grupoMuscular: treinoData.grupoMuscular,
      series: treinoData.series,
      reps: treinoData.reps,
    });
  
    console.log("Manxo, foi", treinos);
    return treinos;
  } catch (error) {
    console.error("Erro ao carregar treinos:", error);
    throw new Error("Erro ao carregar treinos");
  }
};
exports.uploadFicha = async (fichaData) => {
  try {
    const fichas = await createFicha({
      dSemana: fichaData.dSemana,
      duracao: fichaData.duracao,
      gastoCalorico: fichaData.gastoCalorico,
      
    });
    
    console.log("Manxo, foiiiii", fichas);
    return fichas;
  } catch (error) {
    console.error("Erro ao carregar treinos:", error);
    throw new Error("Erro ao carregar treinos");
  }
};
