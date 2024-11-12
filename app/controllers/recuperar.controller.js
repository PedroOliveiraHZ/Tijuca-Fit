const { generateResetToken } = require('../utils/tokenService');
const jwt = require("jsonwebtoken");
const config = require('../config/auth.config');
const bcrypt = require('bcryptjs')
const db = require('../models');
const User = db.user;
const { verifyResetToken } = require('../utils/tokenService');
const nodemailer = require('nodemailer');
const generateToken = (userId) => {
  const payload = {
    id: userId,
  };
  return jwt.sign(payload, config.secret, {
    expiresIn: '60m' // Expira em 1 hora
  });
};

const initiatePasswordResetController = async (req, res) => {
  const { email } = req.body;
  try {
    const resetToken = generateResetToken(email);
    
    // sendPasswordResetEmail(email)
    const link = `${resetToken}`;
    console.log(resetToken)
    console.log('Link de redefinição:', link);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tijucafit72@gmail.com',
        pass: 'wfur ezvl yxpt qwlq'
      },
    });

      await transporter.sendMail({
        from: '"Tijuca Fit" <tijucafit72@gmail.com>',
        to: email,
        subject: "Redefinição de Senha",
        text: `
        Obrigado por usar uma conta Tijuca.
        Acesse a URL a seguir para configurar uma nova senha.
        URL: ${link}
        
        Este processo precisa ser concluído em 1 hora. 
        Após este período, a URL informada acima irá expirar.`,
      });
      return res.status(200).send({ message: "Email de redefinição de senha enviado com sucesso.", link});
    } catch (error) {
      throw new Error("Erro ao enviar email de redefinição de senha: " + error.message);
    }
};

const resetPasswordController = async (req, res) => {
  const { token } = req.params;

  try {
    const { valid, email } = verifyResetToken(token);

    if (!valid) {
      return res.status(400).send('Token inválido ou expirado');
    }
    // Procurar usuário pelo email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }
    // res.render('index', { email: email, token: token });

  } catch (error) {
    console.error('Erro ao verificar o token:', error);
    return res.status(500).send('Erro interno do servidor');
  }
};
const resetPasswordFormSubmitController = async (req, res) => {
  const { token } = req.params;

  try {
    const { newPassword } = req.body;
    // Implemente a validação do formulário aqui, por exemplo:
    // if (password !== confirm_password) {
    //   return res.status(400).send('As senhas não coincidem');
    // }
    const { valid, email } = verifyResetToken(token);
    
    console.log(req.body)
    if (!valid) {
      return res.status(400).send('Token inválido ou expirado');
    }

    // Encripte a nova senha antes de atualizar no banco de dados (use bcrypt ou outro método seguro)
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    // Atualize a senha do usuário no banco de dados
    await User.update({ password: hashedPassword }, { where: { email } });
    
    // Renderize uma página ou redirecione dependendo do seu fluxo de aplicação
    // res.render('passwordResetSuccess', { message: 'Senha alterada com sucesso.' });

  } catch (error) {
    console.error('Erro ao redefinir a senha:', error);
    return res.status(500).send('Erro interno do servidor');
  }
};



module.exports = {
  initiatePasswordResetController,
  resetPasswordController,
  // sendPasswordResetEmail,
  generateToken,
  resetPasswordFormSubmitController
};


// const resetPasswordController = async (req, res) => {
//   // try {
//     const token = req.params.token;
//     console.log(req.params)
//     res.send("ó")
//   const { newPassword } = req.body;
//   await resetPassword(token, newPassword);
//   return res.status(200).send({ message: "Senha alterada com sucesso." });
// } catch (error) {
//   return res.status(500).send({ message: error.message });
// }
// };


// const initiatePasswordResetController = async (req, res) => {
//   try {
//     const token = req.params.token;
//     const { email } = req.body;
//     const resetToken = generateResetToken(email);
//     await initiatePasswordReset(email, token);
//     return res.status(200).send({ message: "Email de redefinição de senha enviado com sucesso.", resetToken});
//   } catch (error) {
//     return res.status(500).send({ message: error.message });
//   }
// };