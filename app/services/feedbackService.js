const {
    createFeedback,
    countUserFeedbacks,
  } = require('../repositories/feedbackRepository');
  const {
    findConquistaById,
  } = require('../repositories/conquistaRepository');
  const {
    findUserConquista,
    createUserConquista,
  } = require('../repositories/userConquistaRepository');
  
  const uploadFeedback = async (userId, feedbackData) => {
    if (feedbackData.classificacao > 5 || feedbackData.classificacao < 1) {
      throw new Error("Apenas valores de 1 a 5");
    }
  
    const feedback = await createFeedback({
      comentario: feedbackData.comentario,
      classificacao: feedbackData.classificacao,
      userId: userId,
    });
  
    const userFeedbackCount = await countUserFeedbacks(userId);
  
    if (userFeedbackCount >= 3) {
      const conquista = await findConquistaById(48);
  
      if (conquista) {
        const userConquista = await findUserConquista(userId, conquista.id);
  
        if (!userConquista) {
          await createUserConquista({
            userId: userId,
            conquistaId: conquista.id,
            data: new Date(),
          });
          console.log("Registro de conquista criado com sucesso.");
        } else {
          console.log("Usuário já possui esta conquista.");
        }
      } else {
        console.log("Conquista não encontrada.");
      }
    }
  
    return feedback;
  };
  
  module.exports = {
    uploadFeedback,
  };
  