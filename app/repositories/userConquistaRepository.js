const db = require("../models");
const userConquista = db.conquistaUser;

const findUserConquista = async (userId, conquistaId) => {
  return await userConquista.findOne({
    where: { userId: userId, conquistaId: conquistaId },
  });
};

const createUserConquista = async (conquistaData) => {
  return await userConquista.create(conquistaData);
};

module.exports = {
  findUserConquista,
  createUserConquista,
};
