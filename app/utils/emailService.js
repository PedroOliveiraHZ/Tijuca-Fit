// const nodemailer = require('nodemailer');
// const { generateResetToken } = require('./tokenService');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'tijucafit72@gmail.com',
//     pass: 'wfur ezvl yxpt qwlq'
//   }
// });

// const sendPasswordResetEmail = async (email) => {
//   try {
//     // Gerar o token de redefinição de senha
//     const resetToken = await generateResetToken(email);
//     // Configuração do email
//     const mailOptions = {
//       from: '"Tijuca Fit" <tijucafit72@gmail.com>',
//       to: email,
//       subject: "Redefinição de Senha",
//       text: `
//       Obrigado por usar uma conta Tijuca.
//       Acesse a URL a seguir para configurar uma nova senha.
//       URL: ${resetToken}
      
//       Este processo precisa ser concluído em 1 hora. 
//       Após este período, a URL informada acima irá expirar.`,
//     };
//     // Enviar o email
//     await transporter.sendMail(mailOptions);

//     return { message: "Email de redefinição de senha enviado com sucesso.", resetToken };
//   } catch (error) {
//     throw new Error("Erro ao enviar email de redefinição de senha: " + error.message);
//   }
// };

// module.exports = {
//   sendPasswordResetEmail,
// };

const nodemailer = require('nodemailer');
const { generateResetToken } = require('../utils/tokenService');
const db  = require('../models');
const Verificacao = db.verificacao
const User = db.user
const crypto = require('crypto')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tijucafit72@gmail.com',
    pass: 'wfur ezvl yxpt qwlq',
  },
});
const geraCodigodeVerificacao = () =>{
  return crypto.randomInt(100000,999999).toString();
}

const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  // Verificar se o email está registrado no sistema
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).send({ message: 'Email não encontrado' });
  }
  //res.status(200).send("Email de confirmação enviado com sucesso")
  try {
    // Gerar o token de redefinição de senha
    const codigoVerificacao= geraCodigodeVerificacao();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await Verificacao.upsert({
      email,
      codigo: codigoVerificacao,
      expiresAt
    })
    // Configuração do email
    const mailOptions = {
      from: '"Tijuca Fit" <tijucafit72@gmail.com>',
      to: email,
      subject: "Código de Verificação de Email",
      text: `Olá,\n\nObrigado por se registrar na Tijuca Fit.\nSeu código de verificação é: ${codigoVerificacao}\n\nEste código é válido por 10 minutos. Após este período, ele expirará.\n\nPor favor, insira esse código na aplicação para confirmar o seu email.\n\nAtenciosamente,\nEquipe Tijuca Fit`,
      html: `
        <p>Olá,</p>
        
        <p>Obrigado por se registrar na Tijuca Fit.</p>
        <p>Seu código de verificação é: <strong>${codigoVerificacao}</strong></p>
        
        <p>Este código é válido por 10 minutos. Após este período, ele expirará.</p>
        
        <p>Por favor, insira esse código na aplicação para confirmar o seu email.</p>
        
        <p>Atenciosamente,</p><br>
        <p>Equipe Tijuca Fit</p>
      `,
    };
    

    // Enviar o email
    await transporter.sendMail(mailOptions);

    return res.status(200).send({ message: "Email de redefinição de senha enviado com sucesso.", codigoVerificacao });
  } catch (error) {
    console.error("Erro ao enviar email de redefinição de senha:", error);
    return res.status(500).send({ message: "Erro ao enviar email de redefinição de senha" });
  }
};
const verifyCode = async (req, res) =>{
  const { codigo } = req.body
try{
if(!codigo){
  return res.status(400).send({message: "E-mail e código são necessários."})
}
const verificacaoEntrada = await Verificacao.findOne({ where:{
  codigo
}})
if(!verificacaoEntrada){
  return res.status(400).send({message: "Código de verificação inválido ou não encontrado"})
}
if(verificacaoEntrada.expiresAt < Date.now()){
  return res.status(400).send({message: "Código de verificação expirado"})
}
return res.status(200).send({message: "Código de verificação válido."})
}catch(error){
return res.status(500).send({message: "Erro ao verificar código"})
}
}


const sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  // Verificar se o email está registrado no sistema
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).send({ message: 'Email não encontrado' });
  }
  //res.status(200).send("Email de confirmação enviado com sucesso")
  try {
    // Gerar o token de redefinição de senha
    const resetToken = generateResetToken(email);

    // Configuração do email
    const mailOptions = {
      from: '"Tijuca Fit" <tijucafit72@gmail.com>',
      to: email,
      subject: "Redefinição de Senha",
      text: `
      Obrigado por usar uma conta Tijuca.
      Acesse a URL a seguir para definir a nova senha.
      URL: ${resetToken}
      
      Este processo precisa ser concluído em 1 hora. 
      Após este período, a URL informada acima irá expirar.`,
    };

    // Enviar o email
    await transporter.sendMail(mailOptions);

    return res.status(200).send({ message: "Email de redefinição de senha enviado com sucesso.", resetToken });
  } catch (error) {
    console.error("Erro ao enviar email de redefinição de senha:", error);
    return res.status(500).send({ message: "Erro ao enviar email de redefinição de senha" });
  }
};

module.exports = { sendVerificationCode, sendVerificationEmail, verifyCode };
