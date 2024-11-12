const { uploadTreinos, uploadFicha } = require('../services/treinosService');
const db = require('../models');
const { where } = require('sequelize');
const Treinos = db.treinos;
const Exercicios = db.exercicio;
const User = db.user;
const Fichas = db.fichas
const Op = db.Sequelize.Op;

exports.mandaTreinos = async (req, res) => {
  const userId = req.userId;
  const treinosData = req.body;

  console.log("Dados recebidos:", treinosData);

  try {
    if (!Array.isArray(treinosData) || treinosData.length === 0) {
      throw new Error("Dados inválidos: um array de exercícios é necessário");
    }

    const fichasCriadas = [];
    const treinosCriados = [];

    const fichasMap = new Map();
    const grupoMuscularCount = {};

    for (const treinoData of treinosData) {
      const { exercicio, grupoMuscular, series, reps, alunoId, dSemana, duracao, gastoCalorico } = treinoData;

      console.log("Dados do treino:", treinoData);

      if (!treinoData) {
        throw new Error("Exercício ID não fornecido");
      }

      const exercicioEncontrado = await db.exercicio.findByPk(exercicio);
      if (!exercicioEncontrado) {
        return res.status(400).send({ message: `Exercício com ID ${exercicioEncontrado} não encontrado` });
      }

      let ficha = fichasMap.get(dSemana);

      if (!ficha) {
        ficha = await db.fichas.create({
          userId: userId,
          alunoId: alunoId || null,
          dSemana: dSemana || '',
          duracao: duracao || null,
          gMusc: grupoMuscular || '',
          gastoCalorico: gastoCalorico || null
        });

        fichasMap.set(dSemana, ficha);
        fichasCriadas.push(ficha);
      }

      if (grupoMuscular) {
        if (!grupoMuscularCount[grupoMuscular]) {
          grupoMuscularCount[grupoMuscular] = 1;
        } else {
          grupoMuscularCount[grupoMuscular]++;
        }
      }

      const treino = await db.treinos.create({
        fichaId: ficha.id,
        exercicio: exercicio,
        grupoMuscular: grupoMuscular || '',
        series: series || null,
        reps: reps || null
      });

      treinosCriados.push(treino);
    }

    let grupoMaisFrequente = null;
    let maxFrequencia = 0;

    for (const grupo in grupoMuscularCount) {
      if (grupoMuscularCount[grupo] > maxFrequencia) {
        maxFrequencia = grupoMuscularCount[grupo];
        grupoMaisFrequente = grupo;
      }
    }

    res.status(200).send({
      message: "Dados salvos com sucesso",
      data: {
        fichas: fichasCriadas,
        treinos: treinosCriados,
        grupoMaisFrequente: grupoMaisFrequente,
        frequencia: grupoMuscularCount,
      }
    });
  } catch (error) {
    console.error("Erro ao salvar treino e ficha:", error);
    res.status(500).send({ message: "Erro ao salvar dados", error });
  }
};

exports.getTreinoByAlunoId = async (req, res) => {
  const userId = req.userId;

  try {
    const diaDaSemana = new Date().getDay();
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const NomeDia = dias[diaDaSemana];


    const ficha = await Fichas.findOne({
      where: {
        alunoId: userId,
        dSemana: NomeDia
      },
      order: [['createdAt', 'DESC']]
    });

    if (!ficha) {
      return res.status(404).json({ message: 'Ficha do aluno não encontrada.' });
    }

    const treinos = await Treinos.findAll({
      where: {
        fichaId: ficha.id,
      },
      order: [['createdAt', 'DESC']]
    });

    if (!treinos.length) {
      return res.status(404).json({ message: 'Nenhum treino encontrado para o dia.' });
    }

    const exercicioIds = treinos.map(treino => treino.exercicio);

    const exercicios = await Exercicios.findAll({
      where: {
        id: exercicioIds
      }
    });

    if (!exercicios) {
      return res.status(404).json({ message: 'Nenhum exercicio encontrado com esse id.' })
    }

    const treinoInfo = treinos.map(treino => {
      const exerciciosInfo = exercicios.find(exercicio => exercicio.id === treino.exercicio);

      return {
        caminho: exerciciosInfo.caminho,
        exercicio: exerciciosInfo.exercicio,
        series: treino.series,
        reps: treino.reps,
        grupoMuscular: treino.grupoMuscular
      }
    });

    return res.status(200).json({ message: "Ficha do aluno:", treinoInfo, ficha, treinos });
  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ message: "Ocorreu um erro ao buscar os treinos." });
  }
};
exports.listaGrupoMuscular = async (req, res) => {
  const userId = req.userId; // ID do usuário logado
  const diaDaSemana = new Date().getDay();
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const NomeDia = dias[diaDaSemana];

  try {
    // Encontrar a ficha do aluno para o dia da semana atual
    const ficha = await Fichas.findOne({ where: { userId, dSemana: NomeDia } });
    if (!ficha) {
      return res.status(404).json({ message: 'Ficha não encontrada.' });
    }

    // Buscar todos os treinos associados à ficha
    const treinos = await Treinos.findAll({
      attributes: ['grupoMuscular'],
      where: { fichaId: ficha.id }
    });

    // Extrair e listar os grupos musculares únicos
    const gruposMusculares = [...new Set(treinos.map(treino => treino.grupoMuscular))];

    return res.status(200).json({ gruposMusculares });
  } catch (error) {
    console.error("Erro ao buscar grupos musculares:", error);
    return res.status(500).json({ message: "Erro interno do servidor ao buscar grupos musculares." });
  }
};
exports.getTreinos = async (req, res) => {
  try {
    const userId = req.userId;
    const diaDaSemana = new Date().getDay();
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const NomeDia = dias[diaDaSemana];
    // Busca os dados do treino e do usuário no banco de dados
    const treinoData = await Treinos.findOne({ where: { userId: userId, dSemana: NomeDia } });
    if (!treinoData) {
      return res.status(404).json({ message: 'Treino não encontrado' });
    }

    const userData = await User.findOne({ where: { id: userId } });
    if (!userData) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const exercicioNomes = [
      treinoData.exercicio1,
      treinoData.exercicio2,
      treinoData.exercicio3,
      treinoData.exercicio4,
      treinoData.exercicio5,
      treinoData.exercicio6,
      treinoData.exercicio7,
      treinoData.exercicio8
    ].filter(name => name);

    // Remove duplicatas
    const uniqueExercicioNomes = [...new Set(exercicioNomes)];

    console.log("Nomes de exercício para busca:", uniqueExercicioNomes);

    // Verifica se há nomes de exercício para buscar
    if (uniqueExercicioNomes.length === 0) {
      return res.status(404).json({ message: 'Nenhum exercício associado a este treino' });
    }

    // Busca os exercícios na tabela Exercicio usando os nomes filtrados
    const exerciciosDoTreino = await Exercicio.findAll({
      where: {
        exercicio: {
          [Op.in]: uniqueExercicioNomes
        }
      }
    });

    console.log("Exercícios encontrados:", exerciciosDoTreino);

    // Dados a serem passados para o template do PDF
    const data = {
      userId: treinoData.userId,
      username: userData.username,
      dSemana: treinoData.dSemana,
      grupoMuscular: treinoData.grupoMuscular,
      exercicios: exerciciosDoTreino.map(exercicio => ({
        exercicio: exercicio.exercicio, // Use o campo correto que armazena o nome do exercício
        series: exercicio.series,
        reps: exercicio.reps,
        caminho: exercicio.caminho
      }))
    };

    // Envia a resposta JSON com os dados
    return res.status(200).json({ message: "Dados do treino", data });

  } catch (error) {
    console.error("Erro ao gerar os Exercicios", error);
    return res.status(500).json({ message: "Erro ao gerar os Exercicios" });
  }
}

