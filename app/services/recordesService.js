const recordesRepository = require('../repositories/recordesRepository');
const db = require('../models');
const Recordes = db.recordes;
const User = db.user; // Assumindo que "user" seja o nome do modelo de usuário
const Exercicio = db.exercicio

class RecordesService {
    async uploadRecorde(userId, exercicioId, recordeData) {
        const recorde = { ...recordeData, userId: userId, exercicioId: exercicioId };
        return await recordesRepository.create(recorde);
    }

    async getRecordes(userId, exercicioId) {
        const user = await User.findByPk(userId); 
        const exercicio = await Exercicio.findbyPk(exercicioId)
        if (!user || !exercicio) {
            throw new Error("Usuário não encontrado.");
        }
        return await recordesRepository.findAllByUserId(userId, exercicioId);
    }

    async updateRecorde(userId, recordeId, updateData) {
        const user = await User.findByPk(userId); // Usando findByPk para encontrar um usuário pelo ID
        if (!user) {
            throw new Error("Dados não encontrados.");
        }
        return await recordesRepository.update(recordeId, updateData);
    }
}

module.exports = new RecordesService();
