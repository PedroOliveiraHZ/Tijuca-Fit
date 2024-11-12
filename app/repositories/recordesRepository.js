const db = require("../models");
const Recordes = db.recordes;

class RecordesRepository {
    async createRecorde(recordeData) {
        return await Recordes.create(recordeData);
    }

    async findAllByUserId(userId, exercicioId) {
        return await Recordes.findAll({
            where: { 
                userId: userId,
                exercicioId: exercicioId
             }
        });
    }

    async update(recordeId, updateData) {
        return await Recordes.update(updateData, {
            where: { id: recordeId }
        });
    }
}

module.exports = new RecordesRepository();
