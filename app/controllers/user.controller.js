const db = require("../models");
const User = db.user;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const imageRepository = require('../repositories/InfouserRepository');


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


function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Erro: Apenas imagens são permitidas!');
    }
}


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image'); 

exports.updateUser = async (req, res) => {
    try {
      
        upload(req, res, async (err) => {
            if (err) {
                console.error("Erro durante o upload da imagem:", err);
                return res.status(400).send({ message: "Erro durante o upload da imagem." });
            }

            const userId = req.params.id; 

            
            let updateData = {};

            
            if (req.file && req.file.originalname) {
                updateData.caminho = `http://192.168.10.204:8080/perfil/${req.file.filename}`;
            }

         
            const user = await User.findByPk(userId);

            if (!user) {
                throw new Error("Usuário não encontrado.");
            }
            if (req.body.username) {
                user.username = req.body.username;
            }
            if (req.body.email) {
                user.email = req.body.email;
            }
            if (req.body.cpf) {
                user.cpf = req.body.cpf;
            }
            if (req.body.telefone) {
                user.telefone = req.body.telefone;
            }
            if (updateData.caminho) {
                user.caminho = updateData.caminho;
            }

            await user.save(); 

            res.status(200).send({ message: "Perfil atualizado com sucesso.", perfil: updateData });
        });
    } catch (error) {
        console.error("Erro na atualização da imagem de perfil:", error);
        res.status(400).send({ message: "Erro durante a atualização da imagem de perfil." });
    }
};


exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await db.user.findOne({
            where: { id: userId }, 
            include: [{
                model: db.role,
                through: {
                    attributes: [] 
                }
            }]
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            cpf: user.cpf,
            telefone: user.telefone,
            caminho: user.caminho,
            createdAt: user.createdAt,
            roles: user.roles.map(role => ({
                id: role.id,
                nome: role.name 
            }))
        };

        return res.status(200).json({ user: userData });
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return res.status(500).json({ message: "Erro interno ao buscar usuário." });
    }
};

exports.userBoard = async (req, res) => {
    const userId = req.userId; 
    try {
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
  
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return res.status(500).json({ message: "Erro interno ao buscar usuário." });
    }
  };