const db = require("../models");
const Conquista = db.conquista;

const findConquistaById = async (id) => {
  return await Conquista.findByPk(id);
};

module.exports = {
  findConquistaById,
};
