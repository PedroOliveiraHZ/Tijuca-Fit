const db = require('../models');
const User = db.user;

exports.createImage = (imageData) => {
    return User.create(imageData);
};

exports.findImageById = (id) => {
    return User.findByPk(id);
};


exports.updateImage = async (updateData) => {
    try {
        const { userId, ...imageData } = updateData;

        const result = await User.update(imageData, {
            where: {
                id: userId // Atualiza o usuário com base no ID fornecido
            }
        });

        if (result[0] === 1) {
            // Significa que um registro foi atualizado com sucesso
            return { message: "Registro atualizado com sucesso." };
        } else {
            throw new Error("Não foi possível encontrar o registro para atualização.");
        }
    } catch (error) {
        throw new Error(`Erro ao atualizar imagem: ${error.message}`);
    }
};

