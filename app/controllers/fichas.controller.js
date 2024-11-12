const PDFDocument = require('pdfkit');
const fs = require('fs');
const db = require("../models");
const Treinos = db.treinos;
const User = db.user;

//===================== Create =========================//

exports.createFicha = async (req, res) => {
    const userId = req.userId;

    try {
        // Verifica se o usuário é um professor
        const user = await User.findByPk(userId);
        if (!user || user.role !== 'moderator') {
            return res.status(403).send({ message: "Apenas professores podem criar fichas." });
        }

        // Cria a ficha atribuindo automaticamente o ProfessorId
        const createdFicha = await Treinos.create({
            ProfessorId: userId, // Definindo automaticamente o ProfessorId como userId
            userId: req.body.userId,
            dSemana: req.body.dSemana,
            exercicioId: req.body.exercicioId,
            series: req.body.series,
            reps: req.body.reps,
            ordem: req.body.ordem,
        });
        res.send({ message: "Ficha registrada com sucesso!", createdFicha });
    } catch (error) {
        console.error("Erro:", error);
        res.status(500).send({ message: error.message });
    }
};

//===================== Read =========================//

exports.getFichas = async (req, res) => {
    const userId = req.userId;
    const alunoId = req.query.alunoId;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: "Usuário não logado." });
        }

        let whereCondition = {};
        if (alunoId) {
            whereCondition = { ...whereCondition, alunoId: alunoId };
        }

        const fichas = await Treinos.findAll({ where: whereCondition });

        // Criação do PDF
        const doc = new PDFDocument();
        const filename = 'fichas.pdf';
        doc.pipe(fs.createWriteStream(filename));

        doc.fontSize(25).text('Fichas de Treino', { align: 'center' });
        doc.moveDown();

        fichas.forEach(ficha => {
            doc.fontSize(15).text(`ID: ${ficha.id}`);
            doc.text(`Aluno ID: ${ficha.userId}`);
            doc.text(`Professor ID: ${ficha.ProfessorId}`);
            doc.text(`Dia da Semana: ${ficha.dSemana}`);
            doc.text(`Exercicio ID: ${ficha.exercicioId}`);
            doc.text(`Series: ${ficha.series}`);
            doc.text(`Reps: ${ficha.reps}`);
            doc.text(`Ordem: ${ficha.ordem}`);
            doc.moveDown();
        });

        doc.end();

        // Envio do PDF como resposta
        res.download(filename, err => {
            if (err) {
                console.error('Erro ao enviar PDF:', err);
                res.status(500).send({ message: 'Erro ao gerar o PDF' });
            }
            fs.unlinkSync(filename); // Remove o arquivo do servidor após enviar ao cliente
        });

    } catch (error) {
        console.error("Erro:", error);
        res.status(500).send({ message: error.message });
    }
};

//===================== Update =========================//

exports.updateFichas = async (req, res) => {
    const userId = req.userId;
    const fichaId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: "Você precisa estar logado para realizar essa ação" });
        }
        const ficha = await Treinos.findOne({ where: { id: fichaId, userId: userId } })
        console.log(ficha)
        console.log(req.userId)
        if (!ficha) {
            return res.status(404).send({ message: "Ficha não encontrada" });
        }

        await Treinos.update(req.body, { where: { id: fichaId } });
        res.send({ message: "Ficha atualizada com sucesso!" })
    } catch (error) {
        console.error("Erro:", error);
        res.status(500).send({ message: error.message });
    }
}

//===================== Delete =========================//

exports.deleteFicha = async (req, res) => {
    const userId = req.userId;
    const fichaId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: "Você precisa estar logado para realizar essa ação" });
        }

        const ficha = await Treinos.findOne({ where: { id: fichaId, userId: userId } });
        if (!ficha) {
            return res.status(404).send({ message: "Ficha não encontrada." });
        }

        await Treinos.destroy({ where: { id: fichaId } });
        res.send({ message: "Ficha excluída com sucesso!" });
    } catch (error) {
        console.error("Erro:", error);
        res.status(500).send({ message: error.message });
    }
};