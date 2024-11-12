const frases = require('../utils/frases.json');
const { Random } = require('random-js');
const random = new Random(); 

// Variável para armazenar a data do último acesso
let ultimaDataAcesso = null;
let ultimaFraseSelecionada = null;

exports.frase = async (req, res) => {
  try {
    const hoje = new Date().toLocaleDateString();

    // Se a última frase foi selecionada hoje, retornamos a mesma frase
    if (ultimaDataAcesso === hoje && ultimaFraseSelecionada) {
      return res.status(200).json({ frase: ultimaFraseSelecionada });
    }

    // Caso contrário, escolhemos uma nova frase aleatória
    const fraseAleatoria = random.pick(frases);

    // Atualizamos a última frase selecionada e a data do último acesso
    ultimaFraseSelecionada = fraseAleatoria;
    ultimaDataAcesso = hoje;

    return res.status(200).json({ frase: fraseAleatoria });
  } catch (error) {
    return res.status(500).json({ message: "Não foi possível obter a frase aleatória", error });
  }
};
