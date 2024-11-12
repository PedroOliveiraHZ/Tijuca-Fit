const bcrypt = require("bcryptjs");
const { findUserByEmail, updateUserPassword } = require('../repositories/recuperar.repositories');
const { generateResetToken, verifyResetToken } = require('../utils/tokenService');
const { sendPasswordResetEmail } = require('../utils/emailService');

const createEncryptedPassword = async (plainPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 8);
    return hashedPassword;
  } catch (error) {
    throw new Error("Erro ao criar senha criptografada.");
  }
};

const initiatePasswordReset = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }
  await sendPasswordResetEmail(email);
};

const resetPassword = async (token, newPassword) => {
  const { valid, email } = verifyResetToken(token);
  if (!valid) {
    throw new Error('Token inválido ou expirado.');
  }
  const hashedPassword = await createEncryptedPassword(newPassword);
  await updateUserPassword(email, hashedPassword);
};

module.exports = {
  createEncryptedPassword,
  initiatePasswordReset,
  resetPassword,
};
