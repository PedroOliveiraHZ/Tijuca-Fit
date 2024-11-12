const pdf = require('html-pdf');
const pdfTemplate = require('../documents');
const db = require("../models");
const Treino = db.treinos;
const Exercicio = db.exercicio;
const Fichas = db.fichas;
const User = db.user;

const generatePdf = (data) => {
    return new Promise((resolve, reject) => {
        pdf.create(pdfTemplate(data), {}).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
};

exports.generateAndFetchPdf = async (req, res) => {
    try {
        const userId = req.userId;
        const diaDaSemana = new Date().getDay();
        const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const NomeDia = dias[diaDaSemana];

        // Busca a ficha associada ao aluno
        const ficha = await Fichas.findOne({
            where: {
                alunoId: userId,
                dSemana: NomeDia
            },
            order: [['createdAt', 'DESC']],
            include: [{
                model: Treino,
                as: 'treinos',
<<<<<<< HEAD
                attributes: ['grupoMuscular', 'series', 'reps', 'exercicio'] // Incluindo os campos corretos do exercício
=======
                attributes: ['grupoMuscular', 'series', 'reps', 'exercicio']
>>>>>>> 794c156153702980c3478676c4851bb5d16bbf3d
            }]
        });

        if (!ficha) {
            return res.status(404).send('Ficha não encontrada');
        }

        const userData = await User.findOne({ where: { id: userId } });
        if (!userData) {
            return res.status(404).send('Usuário não encontrado');
        }

        // Extrai os exercícios da ficha
        const exercicios = ficha.treinos || [];
        console.log("Exercícios da Ficha:", exercicios); // Log para verificar os exercícios retornados

        // Buscar os nomes dos exercícios usando os IDs
<<<<<<< HEAD
        const exercicioIds = exercicios.map(treino => treino.exercicio); // Aqui está sendo utilizado o nome correto do campo
=======
        const exercicioIds = exercicios.map(treino => treino.exercicio);
        console.log("IDs dos Exercícios:", exercicioIds); // Log para verificar os IDs

>>>>>>> 794c156153702980c3478676c4851bb5d16bbf3d
        const nomesExercicios = await Exercicio.findAll({
            where: {
                id: exercicioIds // Verificando o ID com base no nome correto do campo
            },
            attributes: ['id', 'exercicio']
        });

        console.log("Exercícios encontrados:", nomesExercicios); // Log para verificar os nomes encontrados

        // Criar um mapeamento de ID para nome
        const nomePorId = {};
        nomesExercicios.forEach(exercicio => {
            console.log(`Mapeando ID ${exercicio.id}  ${exercicio.exercicio}`); // Log para confirmar o mapeamento
            nomePorId[exercicio.id] = exercicio.exercicio;
        });

        // Dados a serem passados para o template do PDF
        const exerciciosComNomes = exercicios.map(treino => ({
            grupoMuscular: treino.grupoMuscular,
            series: treino.series,
            reps: treino.reps,
            exercicio: nomePorId[treino.exercicio] || 'Exercício não encontrado' // Evitar o retorno de 'Descanso'
        }));

        console.log("Exercícios com Nomes para o PDF:", exerciciosComNomes); // Log para verificar o mapeamento final

        const data = {
            username: userData.username,
            grupoMuscular: exercicios.length > 0 ? exercicios[0].grupoMuscular : 'Desconhecido',
            exercicios: exerciciosComNomes,
        };

        console.log("Dados finais para o PDF:", data); // Log para verificar a estrutura de dados final

        // Gera o PDF usando os dados
        const pdfBuffer = await generatePdf(data);

        // Configuração do cabeçalho para enviar o PDF como resposta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=treino.pdf');

        // Envia o PDF como resposta
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Erro ao gerar o PDF:", error);
        res.status(500).json({ message: "Erro ao gerar o PDF" });
    }
<<<<<<< HEAD
};
=======
};
>>>>>>> 794c156153702980c3478676c4851bb5d16bbf3d
