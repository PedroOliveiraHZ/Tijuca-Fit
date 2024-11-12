const { uploadFeedback } = require('../services/feedbackService');

exports.uploadFeedback = async (req, res) => {
  const userId = req.userId;

  try {
    await uploadFeedback(userId, req.body);
    res.send({ message: "Avaliação enviada com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
