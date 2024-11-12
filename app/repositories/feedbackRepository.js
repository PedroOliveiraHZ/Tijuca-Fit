const db = require("../models");
const Feedback = db.feedback;

const createFeedback = async (feedbackData) => {
  return await Feedback.create(feedbackData);
};

const countUserFeedbacks = async (userId) => {
  return await Feedback.count({ where: { userId: userId } });
};

module.exports = {
  createFeedback,
  countUserFeedbacks,
};
