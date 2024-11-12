// const jwt = require("jsonwebtoken");

// const resetLinkBase = 'http://192.168.10.202:3000/newsenha/';

// const generateResetToken = ( email) => {
//   const payload = {
//     email,
//     expires: Date.now() + 3600000 // 1 hora em milissegundos
//   };
//   const token = jwt.sign(payload, 'bezkoder-secret-key');

//   return `${resetLinkBase}${token}`;
// };

// const verifyResetToken = (token) => {
//   try {
//     const decoded = jwt.verify(token, 'bezkoder-secret-key');
//     if (decoded.expires < Date.now()) {
//       return { valid: false, message: 'Token expirado.' };
//     }
//     return { valid: true, email: decoded.email };
//   } catch (error) {
//     return { valid: false, message: 'Token inválido.' };
//   }
// };

// module.exports = {
//   generateResetToken,
//   verifyResetToken,
// };

const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const resetLinkBase = 'http://192.168.10.202:3000/newsenha/';

const generateResetToken = (email) => {
  const payload = {
    email,
    expires: Date.now() + 3600000 // 1 hora em milissegundos
  };
  const token = jwt.sign(payload, config.secret, { expiresIn: '1h' });

  return `${resetLinkBase}${token}`;
};

const verifyResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.secret);
    if (decoded.expires < Date.now()) {
      return { valid: false, message: 'Token expirado.' };
    }
    return { valid: true, email: decoded.email };
  } catch (error) {
    return { valid: false, message: 'Token inválido.' };
  }
};

module.exports = {
  generateResetToken,
  verifyResetToken,
};
