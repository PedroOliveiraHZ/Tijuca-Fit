const db = require('../models');
const Sequencia = db.sequencia;

exports.getSequenciaByAlunoId = async (req, res) => {
  const userId = req.userId;

  console.log("User ID:", userId); // Adiciona log para verificar o userId

  if (!userId) {
    return res.status(400).send({ message: "Usuário não autenticado." });
  }

  try {
    const sequencia = await Sequencia.findOne({ where: { userId: userId } });
    res.status(200).send({ message: "Total de dias registrados:", sequencia });
  } catch (error) {
    console.log("Erro:", error);
    res.status(500).send({ message: "Erro interno do servidor", error });
  }
};
