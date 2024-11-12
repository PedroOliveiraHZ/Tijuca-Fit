const db = require("../models");
const User = db.user;
const Image = db.image;
const Role = db.role;
const Admin = db.admins
const Professor = db.professores


exports.Allusers = async (req, res) => {
  try {
    const users = await User.findAll();
    const professores = await Professor.findAll();
    const admins = await Admin.findAll();
    
    const allUsers = users.map(user => {
      return {
        ...user.dataValues,
        isProfessor: professores.some(prof => prof.userId === user.id),
        isAdmin: admins.some(admin => admin.userId === user.id),
      };
    });

    res.status(200).json({ allUsers });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.makeUserAdmin = async (req, res) => {
  try {
  const userId = req.userId
  const { id } = req.params; 
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: "coiso não encontrado." });
  }
    const adminRole = await Role.findOne({ where: { name: "admin" } });
    if (!adminRole) {
      return res.status(500).send({ message: "Papel de administrador não encontrado." });
    }

    await user.addRole(adminRole);
    const [admin, created] = await Admin.findOrCreate({
      where: { userId: id },
      defaults: {
        username: user.username,
        email: user.email,
     
      }
    });
    if (!created) {
      await admin.update({
        username: user.username,
        email: user.email,

      });
    }

    return res.status(200).send({ message: "Usuário transformado em administrador com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.removeAdminRole = async (req, res) => {
  try {
  const userId = req.userId
  const { id } = req.params; 
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: "coiso não encontrado." });
  }
    const adminRole = await Role.findOne({ where: { name: "admin" } });
    if (!adminRole) {
      return res.status(500).send({ message: "Papel de administrador não encontrado." });
    }

    await user.removeRole(adminRole);
    await Admin.destroy({ where: { userId: id } });
    return res.status(200).send({ message: "Poder retirado com sucesso! Nerfado" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.makeUserMod = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params; 
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const isModerator = await user.hasRole("moderator");
    if (isModerator) {
      return res.status(400).json({ message: "Usuário já é um moderador." });
    }

    const modRole = await Role.findOne({ where: { name: "moderator" } });
    if (!modRole) {
      return res.status(500).send({ message: "Papel de moderador não encontrado." });
    }

    await user.addRole(modRole);

    const [professor, created] = await Professor.findOrCreate({
      where: { userId: id },
      defaults: {
        username: user.username,
        email: user.email,
     
      }
    });

    if (!created) {
      await professor.update({
        username: user.username,
        email: user.email,

      });
    }

    return res.status(200).send({ message: "Usuário transformado em moderador com sucesso!" });
  } catch (error) {
    res.status(500).send( {message: "Deu b.o. aqui", error });
  }
};
exports.removeModRole = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params; 
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const isModerator = await user.hasRole("moderator");
    if (isModerator) {
      return res.status(400).json({ message: "Usuário já é um moderador." });
    }

    const modRole = await Role.findOne({ where: { name: "moderator" } });
    if (!modRole) {
      return res.status(500).send({ message: "Papel de moderador não encontrado." });
    }
    await user.removeRole(modRole);
    await Professor.destroy({ where: { userId: id } });

    return res.status(200).send({ message: "Papel de moderador removido com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.papeis = async (req, res) => {
  const userId = req.params.id
  try {
      const users = await db.user.findAll({
          include: [{
              model: db.role,
              through: {
                  attributes: [] // Opcional: para não incluir as colunas adicionais da tabela pivot
              }
          }]
      });

      if (!users || users.length === 0) {
          return res.status(404).json({ message: "Nenhum usuário encontrado." });
      }

      // Para cada usuário, user.roles conterá os papéis associados
      // users.forEach(user => {
      //     // console.log(`Papéis do usuário ${user.username}:`, user.roles);
      // });

      return res.status(200).json({ users });
  } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return res.status(500).json({ message: "Erro interno ao buscar usuários." });
  }
};
