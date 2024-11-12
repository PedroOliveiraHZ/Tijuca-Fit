module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "pedro123@",
  DB: "tijuca-fit",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
