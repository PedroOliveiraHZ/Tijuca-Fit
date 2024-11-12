const db = require("../models");
const Imc = db.imc;
const User = db.user;
const {
  findConquistaById,
} = require('../repositories/conquistaRepository');
const {
  findUserConquista,
  createUserConquista,
} = require('../repositories/userConquistaRepository');
// Função para obter o nome do mês
function getMonthName(month) {
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return monthNames[month];
}

// Função para calcular IMC
function calcularIMC(peso, altura) {
  const alturaMetros = altura / 100;
  return peso / (alturaMetros * alturaMetros);
}

// Função para verificar o status de obesidade
function verificarObesidade(imc) {
  if (imc < 16) {
    return 'Magreza grave';
  } else if (imc >= 16 && imc < 16.9) {
    return 'Magreza moderada';
  } else if (imc >= 17 && imc < 18.5) {
    return 'Magreza leve';
  } else if (imc >= 18.5 && imc < 24.9) {
    return 'Peso ideal';
  } else if (imc >= 25 && imc < 29.9) {
    return 'Sobrepeso';
  } else if (imc >= 30.0 && imc < 39.9) {
    return 'Obesidade 2';
  } else {
    return 'Obesidade 3';
  }
}
exports.listaObjetivoAlunos = async (req, res) => {
  const categoriaTreino = req.params.categoriaTreino; // Acessa o parâmetro específico
  try {
    // Busca os usuários com o objetivo especificado
    const usuariosObjetivo = await Imc.findAll({
      where: {
        objetivo: categoriaTreino,
      },
      attributes: ['userId'] // Apenas seleciona o userId
    });

    // Verifica se encontrou algum usuário com o objetivo
    if (usuariosObjetivo.length === 0) {
      return res.status(404).json({
        message: "Nenhum usuário encontrado com o objetivo especificado.",
      });
    }

    // Extrai os IDs dos usuários encontrados
    const usersId = usuariosObjetivo.map(u => u.userId);

    // Busca detalhes dos usuários com base nos IDs encontrados
    const usuariosDetalhados = await db.user.findAll({
      where: { id: usersId },
      attributes: ['id', 'username', 'caminho'], // Ajuste o nome dos campos conforme o seu modelo
    });

    // Verifica se encontrou os detalhes dos usuários
    if (usuariosDetalhados.length === 0) {
      return res.status(404).json({
        message: "Não foi possível encontrar dados sobre o usuário.",
      });
    }

    // Retorna os detalhes dos usuários encontrados
    res.status(200).json({
      message: "Usuários encontrados com o mesmo objetivo",
      usuarios: usuariosDetalhados,
    });

  } catch (error) {
    console.error("Ocorreu um erro ao realizar a pesquisa:", error);
    res.status(500).json({
      message: "Ocorreu um erro interno ao realizar a pesquisa.",
    });
  }
};

exports.listaObjetivo = async (req, res) => {
  const userId = req.userId; // ID do usuário logado

  try {
    // Verificar se o usuário existe
    const userData = await User.findOne({ where: { id: userId } });
    if (!userData) {
      return res.status(404).send('Usuário não encontrado');
    }

    // Buscar todos os objetivos associados ao usuário
    const objetivos = await Imc.findAll({
      attributes: ['objetivo'], // Selecionar apenas o campo `objetivo`
      where: { userId: userId },
    });

    // Extrair apenas os valores do campo `objetivo`
    const objetivosList = objetivos.map(obj => obj.objetivo);

    // Retornar a lista de objetivos
    res.status(200).json({
      message: "Objetivos encontrados com sucesso",
      objetivos: objetivosList // Enviar apenas os valores dos objetivos
    });

  } catch (error) {
    console.error("Erro ao buscar objetivos do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar objetivos." });
  }
};
exports.mandaImc = async (req, res) => {
  const userId = req.userId;
  try {
    // Validar dados de entrada
    if (!req.body.peso || !req.body.altura || !req.body.genero || !req.body.objetivo) {
      return res.status(400).json({ message: 'Dados incompletos.' });
    }

    // Verificar se o usuário existe
    const userData = await User.findOne({ where: { id: userId } });
    if (!userData) {
      return res.status(404).send('Usuário não encontrado');
    }

    const imc = calcularIMC(req.body.peso, req.body.altura);
    const status_obesidade = verificarObesidade(imc);

    // Verificar o tempo desde o último registro
    const ultimoImc = await Imc.findOne({
      where: { userId: userId },
      order: [['createdAt', 'DESC']]
    });
    console.log("User ID:", userId);
    console.log("User:", userData);
    if (ultimoImc) {
      const diff = new Date() - new Date(ultimoImc.createdAt);
      const meses = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));

      if (meses < 1) {
        return res.status(400).json({ message: 'Você só pode enviar uma nova medição após um mês.' });
      }
    }

    // Verificar se o gênero já foi registrado para este usuário
    const existingImc = await Imc.findOne({
      where: { userId: userId, genero: req.body.genero }
    });

    if (existingImc) {
      // Se o gênero já foi registrado, indique que o alerta não deve ser exibido novamente
      res.status(200).send({
        message: "Dados já registrados. Alerta não exibido.",
        status_obesidade: status_obesidade,
        existingImc
      });
    } else {
      // Criar novo registro de IMC
      const createdImc = await Imc.create({
        peso: req.body.peso,
        altura: req.body.altura,
        pesoMeta: req.body.pesoMeta,
        imc: imc,
        genero: req.body.genero,
        objetivo: req.body.objetivo,
        status_obesidade: status_obesidade,
        userId: userId,
        nome_meses: getMonthName(new Date().getMonth())
      });

      res.status(201).send({
        message: "IMC enviado com sucesso! Alerta exibido.",
        status_obesidade: status_obesidade,
        createdImc
      });
    }
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).send({ message: error.message });
  }
};
// exports.mandaImcOutraVez = async (req, res) => {
//   const userId = req.userId;
//   console.log(userId, "AQUI")
//   try {
//     // Validar dados de entrada
//     if (!req.body.peso || !req.body.altura) {
//       return res.status(400).json({ message: 'Dados incompletos.' });
//     }

//     // Verificar se o usuário existe
//     const userData = await User.findOne({ where: { id: userId } });
//         if (!userData) {
//             return res.status(404).send('Usuário não encontrado');
//         }

//     const imc = calcularIMC(req.body.peso, req.body.altura);
//     const status_obesidade = verificarObesidade(imc);

//     // Verificar o tempo desde o último registro
//     const ultimoImc = await Imc.findOne({
//       where: { userId: userId },
//       order: [['createdAt', 'DESC']]
//     });
//     console.log("User ID:", userId);
//     console.log("User:", userData);
//     if (ultimoImc) {
//       const diff = new Date() - new Date(ultimoImc.createdAt);
//       const meses = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));

//       if (meses < 1) {
//         return res.status(400).json({ message: 'Você só pode enviar uma nova medição após um mês.' });
//       }
//     }

//     // Criar novo registro de IMC
//     const createdImc = await Imc.create({
//       peso: req.body.peso,
//       altura: req.body.altura,
//       pesoMeta: req.body.pesoMeta,
//       imc: imc,
//       // genero: req.body.genero,
//       status_obesidade: status_obesidade,
//       userId: userId,
//       nome_meses: getMonthName(new Date().getMonth())
//     });

//     res.status(201).send({ message: "IMC enviado com sucesso!", status_obesidade: status_obesidade, createdImc });
//   } catch (error) {
//     console.error("Erro:", error);
//     res.status(500).send({ message: error.message });
//   }
// };
exports.mandaImcOutraVez = async (req, res) => {
  const userId = req.userId;
  console.log(userId, "AQUI");
  try {
    // Validar dados de entrada
    // if (!req.body.peso) {
    //   return res.status(400).json({ message: 'Coloque todos os valores.' });
    // }

    // Verificar se o usuário existe
    const userData = await User.findOne({ where: { id: userId } });
    if (!userData) {
      return res.status(404).send('Usuário não encontrado');
    }

    const imc = calcularIMC(req.body.peso, req.body.altura);
    const status_obesidade = verificarObesidade(imc);

    // Verificar o tempo desde o último registro
    const ultimoImc = await Imc.findOne({
      where: { userId: userId },
      order: [['createdAt', 'DESC']]
    });

    if (ultimoImc) {
      const diff = new Date() - new Date(ultimoImc.createdAt);
      const meses = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));

      if (meses < 1) {
        return res.status(400).json({ message: 'Você só pode enviar uma nova medição após um mês.' });
      }
    }
    const pesoAnterior = ultimoImc.peso;
    const pesoAtual = req.body.peso;
    const diferencaPeso = Math.abs(pesoAtual - pesoAnterior);

    // Conquista com base na diferença de peso
    if (diferencaPeso >= 5) {
      const conquistaId = 50; // ID da conquista desejada
      const conquista = await findConquistaById(conquistaId);
      if (conquista) {
        const userConquista = await findUserConquista(userId, conquista.id);
        if (!userConquista) {
          await createUserConquista({
            userId: userId,
            conquistaId: conquista.id,
            data: new Date()
          });
          console.log("Conquista por diferença de peso criada com sucesso.");
        } else {
          console.log("Usuário já possui a conquista por diferença de peso.");
        }
      } else {
        console.log("Conquista por diferença de peso não encontrada.");
      }
    }
    if (diferencaPeso >= 10) {
      const conquistaId = 49; // ID da conquista desejada
      const conquista = await findConquistaById(conquistaId);
      if (conquista) {
        const userConquista = await findUserConquista(userId, conquista.id);
        if (!userConquista) {
          await createUserConquista({
            userId: userId,
            conquistaId: conquista.id,
            data: new Date()
          });
          console.log("Conquista por diferença de peso criada com sucesso.");
        } else {
          console.log("Usuário já possui a conquista por diferença de peso.");
        }
      } else {
        console.log("Conquista por diferença de peso não encontrada.");
      }
    }
    // Criar novo registro de IMC
    const createdImc = await Imc.create({
    peso: req.body.peso,
    altura: req.body.altura,
    pesoMeta: req.body.pesoMeta,
    imc: imc,
    status_obesidade: status_obesidade,
    userId: userId,
    nome_meses: getMonthName(new Date().getMonth())
  });

  res.status(201).send({ message: "IMC enviado com sucesso!", status_obesidade: status_obesidade, createdImc });
} catch (error) {
  console.error("Erro:", error);
  res.status(500).send({ message: error.message });
}
};

// exports.mandaImcOutraVez = async (req, res) => {
//   const userId = req.userId;
//   try {
//       // Validar dados de entrada
//       if (!req.body.peso || !req.body.altura) {
//           return res.status(400).json({ message: 'Dados incompletos.' });
//       }

//       // Verificar se o usuário existe
//       const userData = await User.findOne({ where: { id: userId } });
//       if (!userData) {
//           return res.status(404).send('Usuário não encontrado');
//       }

//       const imc = calcularIMC(req.body.peso, req.body.altura);
//       const status_obesidade = verificarObesidade(imc);

//       // Verificar o tempo desde o último registro
//       const ultimoImc = await Imc.findOne({
//           where: { userId: userId },
//           order: [['createdAt', 'DESC']]
//       });

//       if (ultimoImc) {
//           const diff = new Date() - new Date(ultimoImc.createdAt);
//           const meses = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));

//           if (meses < 1) {
//               return res.status(400).json({ message: 'Você só pode enviar uma nova medição após um mês.' });
//           }

//           // Verificar a diferença de peso
//           const pesoAnterior = ultimoImc.peso;
//           const pesoAtual = req.body.peso;
//           const diferencaPeso = Math.abs(pesoAtual - pesoAnterior);

//           // Conquista com base na diferença de peso
//           if (diferencaPeso >= 5) {
//               const conquistaId = 50; // ID da conquista desejada
//               const conquista = await findConquistaById(conquistaId);
//               if (conquista) {
//                   const userConquista = await findUserConquista(userId, conquista.id);
//                   if (!userConquista) {
//                       await createUserConquista({
//                           userId: userId,
//                           conquistaId: conquista.id,
//                           data: new Date()
//                       });
//                       console.log("Conquista por diferença de peso criada com sucesso.");
//                   } else {
//                       console.log("Usuário já possui a conquista por diferença de peso.");
//                   }
//               } else {
//                   console.log("Conquista por diferença de peso não encontrada.");
//               }
//           }
//       }

//       // Verificar se o gênero já foi registrado para este usuário

//           // Criar novo registro de IMC
//           const createdImc = await Imc.create({
//               peso: req.body.peso,
//               altura: req.body.altura,
//               pesoMeta: req.body.pesoMeta,
//               imc: imc,
//               status_obesidade: status_obesidade,
//               userId: userId,
//               nome_meses: getMonthName(new Date().getMonth())
//           });

//           res.status(201).send({
//               message: "IMC enviado com sucesso! Alerta exibido.",
//               status_obesidade: status_obesidade,
//               createdImc
//           });
//       }
//   } catch (error) {
//       console.error("Erro:", error);
//       res.status(500).send({ message: error.message });
//   }
// };



exports.ultimo = async (req, res) => {
  try {
    const userId = req.userId;
    const ultimoImc = await Imc.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    if (!ultimoImc) {
      return res.status(404).json({ message: 'Nenhum IMC encontrado para este usuário' });
    }

    res.status(200).json({ imc: ultimoImc.imc });
  } catch (error) {
    console.error('Erro ao obter último IMC:', error);
    res.status(500).json({ message: 'Erro ao obter último IMC' });
  }
};

exports.pegaImc = async (req, res) => {
  const userId = req.userId;
  try {
    const imcUser = await Imc.findAll({
      where: { userId: userId },
      order: [['createdAt', 'DESC']]
    });

    // Adiciona o nome dos meses ao objeto de resposta
    const resposta = imcUser.map(imc => {
      const dataImc = new Date(imc.createdAt);
      const mesImc = dataImc.getMonth();
      const nomeMesImc = getMonthName(mesImc);

      return {
        ...imc.toJSON(),
        nome_meses: nomeMesImc
      };
    });

    return res.status(200).json({ imcUser: resposta });
  } catch (error) {
    console.error("Erro ao buscar IMC:", error);
    res.status(500).json({ message: "Erro ao buscar IMC do usuário." });
  }
};

