const db = require('../models');
const User = db.user;
const Role = db.role;
const Professor = db.professores;
const Admins = db.admins;

const bcrypt = require('bcryptjs');
const Op = db.Sequelize.Op;

exports.createUser = async (username, email, password, roles) => {
  let transaction;
  try {
    // Inicia uma transação para garantir a consistência dos dados
    transaction = await db.sequelize.transaction();

    // Cria o usuário
    const user = await User.create({
      username: username,
      email: email,
      password: bcrypt.hashSync(password, 8),
    }, { transaction });

    // Verifica se o papel de moderador está presente
    if (roles && roles.length > 0) {
      const fetchedRoles = await Role.findAll({
        where: {
          name: {
            [Op.or]: roles,
          },
        },
      }, { transaction });

      // Verifica se o usuário tem o papel de moderador
      const isModerator = fetchedRoles.some(role => role.name === 'moderator');
      if (isModerator) {
        // Se o usuário for moderador, cria um registro na tabela de professores
        await Professor.create({
          username: user.username,
          email: user.email,
          userId: user.id,
          // Outros campos do professor podem ser preenchidos aqui
        }, { transaction });
      }
      const isAdmin = fetchedRoles.some(role => role.name === 'admin');
      if (isAdmin) {
        await Admins.create({
          username: user.username,
          email: user.email,
          userId: user.id,

        }, { transaction })
      }
      // Define os papéis do usuário
      await user.setRoles(fetchedRoles, { transaction });
    } else {
      // Se nenhum papel for fornecido, atribui o papel padrão
      const defaultRole = await Role.findOne({ where: { name: 'user' } });
      await user.setRoles([defaultRole], { transaction });
    }

    // Confirma a transação
    await transaction.commit();

    return { message: "Usuário registrado com sucesso!" };
  } catch (error) {
    // Reverte a transação em caso de erro
    if (transaction) await transaction.rollback();
    throw new Error(error.message);
  }
}

exports.findByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: {
        email: email
      }
    });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}
