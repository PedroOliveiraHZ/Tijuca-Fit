const db = require("../models");
const Conquista = db.conquista;
const ConquistaUser = db.conquistaUser
const User = db.user
const multer = require('multer');
const path = require('path');
const { where } = require("sequelize");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', '..', 'public', 'conquistas');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('image');
exports.uploadConquista = async (req, res) => {
  upload(req, res, (err) => {

    if (err instanceof multer.MulterError) {
      return res.status(500).send({ message: "Erro durante o upload da imagem." });
    }
    if (!req.file) {
      return res.status(400).send({ message: "Nenhuma imagem foi enviada." });
    }
    const imagePath = req.file.path;
    return res.status(200).send({ message: "Imagem de conquista enviada com sucesso.", imagePath: imagePath });
  });
};
exports.conquistaUser = async (req, res) => {
  const userId = req.userId;
  console.log(userId)
  try {
    if (!userId) {
      return res.status(400).json({ message: "Usuário não autenticado." });
    }

    const conquistasUser = await ConquistaUser.findAll({
      where: { userId: userId },
      include: [{
        model: Conquista,
        attributes: ['id', 'nome', 'descricao', 'caminho'],
      }]
    });
    res.status(200).send({ message: "Conquistas encontradas com sucesso", conquistasUser });
  } catch (error) {
    console.error("Ocorreu um erro ao buscar as conquistas do usuário", error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar as conquistas do usuário." });
  }
}

exports.conquistasById = async (req, res) => {
  const userId = req.params.id;

  try {
    const getConquistasById = await ConquistaUser.findAll({
      where: { userId: userId },
      include: [{
        model: Conquista,
        attributes: ['nome','caminho'],
      }]
    })
    res.status(200).send({message:`Consquistas do usuário de id ${userId}:`, getConquistasById})
  } catch (error) {
    console.error("Ocorreu um erro ao buscar as conquistas do usuário", error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar as conquistas do usuário." });
  }
}

exports.verTodasAsConquistas = async (req, res) => {
  try {
    const conquistas = await Conquista.findAll();
    res.status(200).json(conquistas);
  } catch (error) {
    console.error("Erro ao buscar conquistas:", error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar as conquistas." });
  }
};
