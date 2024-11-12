
// const db = require('../models')
// const Recordes = db.recordes
// const sequelize = require('sequelize')
// const recordesService = require('../services/recordesService');

// exports.createRecorde = async (req, res) => {
//   const userId = req.userId;
//   const exercicioId = req.body.exercicioId;

//   try {
//     const { carga } = req.body;
//     const novaMarca = await Recordes.create({ userId, exercicioId, carga });
//     res.status(201).json(novaMarca);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getRecordes = async (req, res) => {
//   const userId = req.params.userId;
//   const exercicioId = req.params.exercicioId;

//   try {
//     const cargaMaximaUsuario = await Recordes.findOne({
//       where: {
//         userId,
//         exercicioId
//       },
//       attributes: [[sequelize.fn('MAX', sequelize.col('carga')), 'cargaMaxima']],
//     });
//     const ultimaCargaUsuario = await Recordes.findOne({
//       where: {
//         userId,
//         exercicioId
//       },
//       order: [['createdAt', 'DESC']],
//       attributes: ['carga'],
//     });
//     res.status(200).json({
//       cargaMaximaUsuario: cargaMaximaUsuario ? cargaMaximaUsuario.dataValues.cargaMaxima : 0,
//       ultimaCargaUsuario: ultimaCargaUsuario ? ultimaCargaUsuario.dataValues.carga : 0,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const sequelize = require("sequelize")
const db = require("../models");
const Recordes = db.recordes

exports.createRecorde = async (req, res) => {
    const userId = req.userId;
    const exercicioId = req.body.exercicioId;

    try {
        const {carga } = req.body;
        const novaMarca = await Recordes.create({ userId, exercicioId, carga });
        res.status(201).json(novaMarca);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};

exports.getRecordes = async (req, res) => {
    const userId = req.params.userId;
    const exercicioId = req.params.exercicioId;

    try {    
        const recordesAnt = await Recordes.findAll({
          where:{
            userId: userId,
            exercicioId: exercicioId
          }
        })

        const cargaMaximaUsuario = await Recordes.findOne({
          where: { 
            userId: userId,
            exercicioId: exercicioId 
          },
          attributes: [[sequelize.fn('MAX', sequelize.col('carga')), 'cargaMaxima']],
        });

        const ultimaCargaUsuario = await Recordes.findOne({
            where: { 
              userId: userId,
              exercicioId:exercicioId 
            },
            order: [['createdAt', 'DESC']],
            attributes: ['carga'],
          });
          
        res.status(200).json({
          cargaMaximaUsuario: cargaMaximaUsuario ? cargaMaximaUsuario.dataValues.cargaMaxima : 0,
          ultimaCargaUsuario: ultimaCargaUsuario ? ultimaCargaUsuario.dataValues.carga : 0,
          recordesAnt,

        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};