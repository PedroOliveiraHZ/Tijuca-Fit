const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', '..', 'public', 'exercicios');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = uuidv4() + path.extname(file.originalname);
    cb(null, filename);
  }
});

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|svg|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Erro: Apenas imagens são permitidas!');
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

module.exports = upload;
