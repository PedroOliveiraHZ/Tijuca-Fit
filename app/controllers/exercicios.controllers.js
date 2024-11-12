const upload = require('../middleware/uploadMiddleware');
const db = require('../models');
const {
  addExercicio,
  getAllExercicios,
  getExercicioByIdOrName,
} = require('../services/exercicioService');

const Exercicios = db.exercicio

exports.addExercicio = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ message: 'Erro durante o upload da imagem.'});
    }

    const { exercicio, grupoMuscular, reps, series } = req.body;
    const nomeImagem = req.file.originalname;
    const userId = req.userId;
    const caminho = `http://192.168.10.204:8080/exercicios/${req.file.filename}`;

    try {
      const novoExercicio = await addExercicio({
        exercicio,
        nome_da_imagem: nomeImagem,
        userId,
        caminho,
        grupoMuscular,
        series,
        reps,
      });
      res.status(200).send({ message: 'Imagem de exercicio enviada com sucesso.', exercicio: novoExercicio });
    } catch (error) {
      res.status(500).send({ message: 'Erro interno do servidor ao salvar o exercicio.' });
    }
  });
};

exports.getAllExercicios = async (req, res) => {
  try {
    const exercicios = await getAllExercicios();
    res.status(200).json(exercicios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExercicioByIdOrName = async (req, res) => {
  const exercicioId = req.params.id;
  try {
    const exercicio = await getExercicioByIdOrName(exercicioId);
    res.status(200).json(exercicio);
  } catch (err) {
    res.status(404).json({ message: 'Exercício não encontrado.' });
  }
};

exports.getExerciciosByGroup = async (req, res) => {
  const grupoMuscular = req.params.grupoMuscular;
  console.log("grupo:", grupoMuscular)

  try {
    if (!grupoMuscular) {
      return res.status(400).json({ error: 'Grupo muscular não fornecido' });
    }
    const exerciciosGrupo = await Exercicios.findAll({
      where: { grupoMuscular: grupoMuscular }
    });

    res.status(200).json(exerciciosGrupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
