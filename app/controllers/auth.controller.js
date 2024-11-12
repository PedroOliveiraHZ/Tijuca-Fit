const authService = require('../services/auth.service')
const db = require('../models')
const User = db.user
exports.signup = async (req, res) => {
  // Salvar no banco de dados
  try {
    const { username, email, password, roles } = req.body;
    const result = await authService.signup(username, email, password, roles);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.signIn(email, password);

    // Verificar se o usuário já viu o formulário
    const userData = await User.findByPk(user.id); // Obtém o usuário do banco de dados
    const formShown = userData.formShown;

    // Atualizar o campo formShown para true
    if (!formShown) {
      await userData.update({ formShown: true });
    }

    res.status(200).send({
      ...user,
      formShown // Inclui a informação de se o formulário foi mostrado
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
// exports.signin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const userData = await authService.signIn(email, password);
//     // req.session.token = userData.token;
//     // localStorage.setItem('token', userData.token);
//     res.status(200).send(userData);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
  
// }
exports.duplicated= async (req,res) =>{
  const email = req.query.email;

  if (!email) {
    return res.status(400).send({
      message: "Email não fornecido."
    });
  }

  try {
    const user = await User.findOne({
      where: { email: email }
    });

    if (user) {
      return res.status(200).send({
        message: "O e-mail já está em uso!"
      });
    } else {
      return res.status(200).send({
        message: "O e-mail está disponível."
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};
exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "Você foi desconectado!"
    });
  } catch (err) {
    this.next(err);
  }
};
// const authService = require('../services/auth.service');

// exports.signup = async (req, res) => {
//   try {
//     const { username, email, password, roles } = req.body;
//     const result = await authService.signup(username, email, password, roles);
//     res.send(result);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// }

// exports.signin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const userData = await authService.signIn(email, password);
//     console.log("Dados do usuário após signin:", userData); // Log para depuração
//     res.status(200).send(userData);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// }

// exports.signout = async (req, res) => {
//   try {
//     req.session = null;
//     return res.status(200).send({
//       message: "Você foi desconectado!"
//     });
//   } catch (err) {
//     this.next(err);
//   }
// };