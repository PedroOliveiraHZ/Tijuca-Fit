const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization; // Extrai o token do cabeçalho Authorization
  

  if (!token) {
    return res.status(403).send({
      message: "Nenhum token fornecido!",
    });
  }

  // O token geralmente vem no formato 'Bearer tokenjwt'. Vamos separar o token real.
  token = token.split(" ")[1];

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Não autorizado!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId)
    .then(user => {
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {

            return next(); // Corrigido aqui: return next() em vez de next()
          }
        }
        return res.status(403).send({
          message: "Erro!"
        });
      });
    })
    .catch(err => {
      return res.status(500).send({
        message: "Erro ao buscar usuário!",
      });
    });
};

const isModerator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    const isModerator = roles.some(role => role.name === "moderator");

    if (isModerator) {
      return next();
    }

    return res.status(403).send({
      message: "Requer papel de moderador!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Incapaz de validar a função de moderador!",
    });
  }
};

const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    const isAdmin = roles.some(role => role.name === "admin");
    const isModerator = roles.some(role => role.name === "moderator");

    if (isAdmin || isModerator) {
      return next();
    }

    return res.status(403).send({
      message: "Requer papel de moderador ou administrador!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Incapaz de validar a função de moderador ou administrador!",
    });
  }
}


module.exports = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};
