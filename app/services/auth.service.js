// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('../config/auth.config');
// const { findByEmail } = require('../repositories/auth.repositories');
// const userRepository = require('../repositories/auth.repositories');
// exports.signup = async(username, email, password, roles) => {
//   try {
//     const result = await userRepository.createUser(username, email, password, roles);
//     return result;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }
// exports.signIn = async (email, password) => {
//     try {
//       const user = await findByEmail(email);

//       if (!user) {
//         throw new Error("Usuário não encontrado.");
//       }

//       const passwordIsValid = bcrypt.compareSync(password, user.password);

//       if (!passwordIsValid) {
//         throw new Error("Senha inválida!");
//       }
//       //==================== Guardar no TOKEN ===========//
//       const token = jwt.sign({ id: user.id, email:user.email, username: user.username}, config.secret, {
//         algorithm: 'HS256',
//         allowInsecureKeySizes: true,
//         expiresIn: "3d", // 24 horas
//       });

//       let authorities = [];
//       const roles = await user.getRoles();
//       for (let i = 0; i < roles.length; i++) {
//         authorities.push("ROLE_" + roles[i].name.toUpperCase());
//       }
      
//       return {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         caminho: user.caminho,
//         roles: authorities,
//         token: token
//       };
      
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { findByEmail } = require('../repositories/auth.repositories');
const userRepository = require('../repositories/auth.repositories');

exports.signup = async (username, email, password, roles) => {
  try {
    const result = await userRepository.createUser(username, email, password, roles);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

exports.signIn = async (email, password) => {
  try {
    const user = await findByEmail(email);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      throw new Error("Senha inválida!");
    }

    // Obter as roles do usuário
    const roles = await user.getRoles();

    // Mapear as roles para um array de strings com "ROLE_<role>"
    const authorities = roles.map(role => "ROLE_" + role.name.toUpperCase());

    // Gerar o token JWT com as informações necessárias
    const token = jwt.sign({
      id: user.id,
      email: user.email,
      username: user.username,
      roles: authorities // Incluir as roles no payload do token
    }, config.secret, {
      algorithm: 'HS256',
      expiresIn: "3d" // Token expira em 3 dias
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      caminho: user.caminho,
      roles: authorities, // Retornar as roles como parte do objeto de resposta
      token: token
    };

  } catch (error) {
    throw new Error(error.message);
  }
}