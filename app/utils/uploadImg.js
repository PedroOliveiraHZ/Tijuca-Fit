
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Para gerar IDs únicos
const db = require('../models')
const Conquista = db.conquista

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..','..','public', 'conquistas');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = uuidv4() + path.extname(file.originalname); // Nome de arquivo único com extensão original
    cb(null, filename);
  }
});

// Opções de upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limita o tamanho do arquivo para 5MB (opcional)
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image'); // 'image' é o nome do campo no formulário de upload

// Função para verificar o tipo de arquivo (apenas imagens)
function checkFileType(file, cb) {
  // Extensões permitidas
  const filetypes = /jpeg|jpg|png|svg/;
  // Verifica a extensão do arquivo
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Verifica o tipo do arquivo
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Erro: Apenas imagens são permitidas!');
  }
}

// Função para manipular o upload de imagens
const handleImageUpload = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ message: "Erro durante o upload da imagem." });
    }

    // Extrair informações adicionais do corpo da requisição
    const { id, nome, descricao } = req.body;

    // Verificar se as informações adicionais foram fornecidas
    if (!id || !nome || !descricao) {
      return res.status(400).send({ message: "ID, nome e descrição são obrigatórios." });
    }
    const nomeImagem = req.file.originalname;
    const userId = req.userId
    try {
      // Salvar os dados no banco de dados usando o modelo Conquista
      const novaConquista = await Conquista.create({
        nome: nome,
        descricao: descricao,
        imagem_da_conquista: nomeImagem,
        userId: userId,
        caminho: `http://192.168.10.204:8080/conquistas/${req.file.filename}`
      });
    return res.status(200).send({ message: "Imagem de conquista enviada com sucesso.", conquista: novaConquista });
  } catch (error) {
    console.error("Erro ao salvar conquista:", error);
    return res.status(500).send({ message: "Erro interno do servidor ao salvar a conquista." });
  }
  });
};
module.exports = handleImageUpload;