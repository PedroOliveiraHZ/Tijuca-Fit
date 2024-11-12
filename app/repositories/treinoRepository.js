const db = require('../models')
const Treinos = db.treinos
const Fichas = db.fichas


const createTreino = async (treinoData) =>{
  console.log("Dados da ficha recebidos:", treinoData)
  return await Treinos.create(treinoData);
}
const createFicha = async (fichaData) =>{
  console.log("Dados da ficha recebidos:", fichaData)
  return await Fichas.create(fichaData);
}


const countUserTreinos = async (userId) => {
  return await Treinos.count({ where: { userId: userId } });
};

module.exports ={
  countUserTreinos,
  createTreino,
  createFicha
}