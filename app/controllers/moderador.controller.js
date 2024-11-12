const db = require("../models");
const User = db.user;
const Image = db.image;

exports.moderatorBoard = (req, res) => res.status(200).send("Moderator Content.");