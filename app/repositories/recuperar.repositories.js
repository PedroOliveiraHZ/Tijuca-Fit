const db = require("../models");
const User = db.user;

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const updateUserPassword = async (email, hashedPassword) => {
  const user = await findUserByEmail(email);
  if (user) {
    user.password = hashedPassword;
    await user.save();
  }
};

module.exports = {
  findUserByEmail,
  updateUserPassword,
};
