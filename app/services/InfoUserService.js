const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const imageRepository = require('../repositories/InfouserRepository');
const db = require('../models')
const Image = db.image
// Configuração do armazenamento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', '..', 'public', 'perfil');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const filename = uuidv4() + path.extname(file.originalname);
        cb(null, filename);
    }
});
// Opções de upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// Função para verificar o tipo de arquivo (apenas imagens)
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Erro: Apenas imagens são permitidas!');
    }
}

exports.uploadImage = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, async (err) => {
            if (err) {
                return reject(new Error("Erro durante o upload da imagem."));
            }

            const { nome_completo, cpf, telefone } = req.body;
            // const nomeImagem = req.file.originalname;
            const userId = req.userId;

            try {
                let novaImagemPerfil = {
                    nome_completo,
                    cpf,
                    telefone,
                    userId,
                };
                if (req.file && req.file.originalname) {
                    novaImagemPerfil.nome_da_imagem = req.file.originalname;
                    novaImagemPerfil.caminho = `http://192.168.10.204:8080/perfil/${req.file.filename}`;
                }

                const addImagemPerfil = await imageRepository.createImage(novaImagemPerfil);

                resolve({ message: "Imagem de perfil enviada com sucesso.", perfil: novaImagemPerfil  });
            } catch (error) {
              
                reject(new Error("Erro interno do servidor ao salvar a imagem de perfil."));
            }
        });
    });
};
exports.updateImage = async (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, async (err) => {
            if (err) {
                return reject(new Error("Erro durante o upload da imagem."));
            }

            const { nome_completo, cpf, telefone } = req.body;
            const userId = req.userId; // Verifique se req.userId está definido corretamente

            try {
                let updateData = {
                    nome_completo,
                    cpf,
                    telefone,
                    userId // Certifique-se de incluir userId nos dados de atualização
                };

                // Verificar se uma nova imagem foi enviada
                if (req.file && req.file.originalname) {
                    updateData.nome_da_imagem = req.file.originalname;
                    updateData.caminho = `http://192.168.10.204:8080/perfil/${req.file.filename}`;
                }

                const updateImagemPerfil = await imageRepository.updateImage(updateData);

                resolve({ message: "Perfil atualizado com sucesso.", perfil: updateData });
            } catch (error) {
                reject(error);
            }
        });
    }).then((result) => {
        res.status(200).send(result);
    }).catch((error) => {
        console.error("Erro na atualização da imagem de perfil:", error);
        res.status(400).send({ message: "Erro durante a atualização da imagem de perfil." });
    });
};



   