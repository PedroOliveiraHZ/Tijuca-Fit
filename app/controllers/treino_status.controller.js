const db = require("../models");
const { formatDateToYYYYMMDD } = require('../utils/date')
const Fichas = db.fichas
const Treino = db.treinos
const User = db.user
const Sequencia = db.sequencia
const Status = db.status;
const { where, Sequelize, sequelize, Op } = require("sequelize");
const {
    findConquistaById,
} = require('../repositories/conquistaRepository');
const {
    findUserConquista,
    createUserConquista,
} = require('../repositories/userConquistaRepository');

exports.countUserStatus = async (userId, grupoMuscular) => {
    try {
        const count = await Status.count({
            where: {
                userId: userId,
                grupoMuscular: grupoMuscular
            }
        });
        console.log(count, "ajkdghadg")
        return count;
    } catch (error) {
        console.error("Erro ao contar status do usuário:", error);
        throw error;
    }
};

exports.userStatus = async (req, res) => {
    const userId = req.userId;

    try {
        const countStatus = await Status.count({ where: { userId: userId } });

        const totals = await Status.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('gastoCalorico')), 'totalGastoCalorico'],
                [Sequelize.fn('SUM', Sequelize.col('duracao')), 'totalDuracao']
            ],
            where: { userId: userId },
            raw: true
        });

        console.log('Totais retornados:', totals);

        return res.status(200).json({
            count: countStatus,
            totalGastoCalorico: totals ? totals.totalGastoCalorico || 0 : 0,
            totalDuracao: totals ? totals.totalDuracao || 0 : 0
        });
    } catch (error) {
        console.error("Erro ao contar status:", error);
        return res.status(500).json({ message: "Erro ao contar status do usuário", error: error.message });
    }
};
exports.getTreinosSemanaAtual = async (req, res) => {
    try {
        console.log('Início da execução');

        const startTime = Date.now();
        const userId = req.userId;

        const today = new Date();
        const dayOfWeek = today.getDay();

        const daysOfWeek = [
            'Domingo',
            'Segunda',
            'Terça',
            'Quarta',
            'Quinta',
            'Sexta',
            'Sábado'
        ];
        const treinos = await Status.findAll({
            where: { userId: userId }
        });
        console.log('Tempo para encontrar todos os treinos:', Date.now() - startTime, 'ms');
        console.log('Treinos encontrados:', treinos);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
        endOfWeek.setHours(23, 59, 59, 999);

        const treinosSemanaAtual = treinos.filter(treino => {
            const treinoDate = new Date(treino.dataValues.data);
            return treinoDate >= startOfWeek && treinoDate <= endOfWeek;
        }).map(treino => ({
            diaSemana: treino.dataValues.dSemana,
            detalhes: treino.dataValues
        }));

        const diasComTreino = new Set(treinosSemanaAtual.map(treino => treino.diaSemana));
        const treinosCompletos = daysOfWeek.every(day => diasComTreino.has(day));

        return res.status(200).send({ message: 'Treinos da semana atual', treinosCompletos, treinosSemanaAtual });

    } catch (error) {
        console.error('Erro ao buscar treinos da semana atual:', error);
        res.status(500).send({ message: 'Erro ao buscar treinos da semana atual' });
    }
};

exports.isTreinoCompletoMes = async (userId) => {
    try {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

        const completedDays = await Status.findAll({
            where: {
                userId: userId,
                data: {
                    [Op.between]: [startOfMonth, endOfMonth]
                },
                status: 1
            }
        });

        const daysInMonth = endOfMonth.getDate();
        const daysCompleted = new Set(completedDays.map(record => new Date(record.data).getDate()));

        return daysCompleted.size === daysInMonth;
    } catch (error) {
        console.error("Erro ao verificar treinos completos no mês:", error);
        return false;
    }
};

exports.isTreinoCompletoHoje = async (userId) => {
    try {
        // Obtém a data atual e formata
        const hoje = new Date();
        const formattedDate = formatDateToYYYYMMDD(hoje); // Formata a data atual
        console.log(`Data formatada para consulta: ${formattedDate}`); // Exibe a data formatada

        const completedDays = await Status.findAll({
            where: {
                userId: userId,
                status: 1 // Status 1 representa "completo"
            }
        });

        const formattedDays = completedDays.map(record => ({
            data: record.data, // ou record.data.toISOString().split('T')[0] se necessário
            dSemana: record.dSemana
        }));

        console.log(`Dias completos encontrados: ${formattedDays.length}`); // Exibe o número de dias encontrados

        return formattedDays; // Retorna a lista de dias completos
    } catch (error) {
        console.error("Erro ao buscar dias completos:", error);
        return {
            status: 'erro',
            message: error.message
        };
    }
};

exports.checkTreinoStatus = async (req, res) => {
    const userId = req.userId;
    try {
        const completedDays = await exports.isTreinoCompletoHoje(userId);
        return res.status(200).json({ completedDays });
    } catch (error) {
        console.error("Erro ao verificar status do treino:", error);
        return res.status(500).json({ message: "Erro ao verificar status do treino", error: error.message });
    }
};
exports.getStatusDuracao = async (req, res) => {
    const userId = req.userId;
    try {
        const diaDaSemana = new Date().getDay();
        const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const NomeDia = dias[diaDaSemana];
        const getInformacoes = await Fichas.findAll({
            where: { userId: userId, dSemana: NomeDia },
            attributes: [
                'duracao', 'gastoCalorico'
            ]
        });
        return res.status(200).json({
            data: getInformacoes
        });
    } catch (error) {
        console.error("Erro ao contar status:", error);
        return res.status(500).json({ message: "Erro ao contar status do usuário", error: error.message });
    }
}
exports.getStatusInfo = async (req, res) => {
    const userId = req.userId;
    try {

        const getInfos = await Status.findAll({ where: { userId: userId } });

        const somaStatus = await Status.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('duracao')), 'totalDuracao'],
                [Sequelize.fn('SUM', Sequelize.col('gastoCalorico')), 'totalGasto']
            ],
            where: {
                userId: userId
            },
            raw: true
        });

        const totalDuracao = somaStatus.totalDuracao;
        const totalGasto = somaStatus.totalGasto;

        return res.status(200).json({

            totalDuracao,
            totalGasto
        });
    } catch (error) {
        console.error("Erro ao contar status:", error);
        return res.status(500).json({ message: "Erro ao contar status do usuário", error: error.message });
    }
}

exports.createStatus = async (req, res) => {
    const userId = req.userId;

    try {
        const diaDaSemana = new Date().getDay();
        const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const NomeDia = dias[diaDaSemana];
        const date = new Date();
        const formattedDate = formatDateToYYYYMMDD(date);
        console.log(`Data formatada para inserção: ${formattedDate}`);

        const aluno = await User.findOne({
            where: {
                id: userId
            },
            attributes: [
                'id', 'username'
            ]
        })

        const alunoId = aluno.id

        console.log("alunoId:", alunoId);

        const treino = await Fichas.findOne({
            where: {
                alunoId: alunoId,
                dSemana: NomeDia
            }
        });

        if (!treino) {
            return res.status(404).send({ message: `Algo deu errado: ${alunoId}` });
        }

        const sequenciaDias = await Sequencia.findOne({ where: { userId: userId } });

        if (sequenciaDias) {
            const lastStatusDate = new Date(sequenciaDias.updatedAt);
            const currentDate = new Date();
            const daysDifference = Math.ceil((currentDate - lastStatusDate) / (1000 * 60 * 60 * 24));

            if (daysDifference > 1) {
                if (daysDifference > 30) {
                    const conquistaQuebraSequencia = await findConquistaById(64);
                    if (conquistaQuebraSequencia) {
                        const userConquistaQuebraSequencia = await findUserConquista(userId, conquistaQuebraSequencia.id);
                        if (!userConquistaQuebraSequencia) {
                            await createUserConquista({
                                userId: userId,
                                conquistaId: conquistaQuebraSequencia.id,
                                data: new Date()
                            });
                            console.log("Conquista de quebra de sequência concedida com sucesso.");
                        } else {
                            console.log("Usuário já possui a conquista de quebra de sequência.");
                        }
                    } else {
                        console.log("Conquista de quebra de sequência não encontrada.");
                    }
                }
                await Sequencia.update({ dias: 1 }, { where: { userId: userId } });
            } else {
                await Sequencia.update(
                    { dias: parseInt(sequenciaDias.dias, 10) + 1 },
                    { where: { userId: userId } }
                );
            }
        } else {
            await Sequencia.create({
                userId: userId,
                dias: 1
            });
        }

        // Cria o status de treino
        const createdStatus = await Status.create({
            userId: userId,
            data: formattedDate,
            dSemana: NomeDia,
            duracao: treino.duracao,
            grupoMuscular: treino.gMusc,
            gastoCalorico: treino.gastoCalorico,
            status: 1,
        });

        //========================== Conquistas ===============================//
        const sequencia = await Sequencia.findOne({ where: { userId: userId } });

        if (!sequencia) {
            return res.status(500).send({ message: "Erro ao recuperar sequência." });
        }

        const diasConcluidos = sequencia.dias;

        // Conquista de 1 semana
        if (diasConcluidos >= 3) {
            const conquista1Semana = await findConquistaById(55);
            if (conquista1Semana) {
                const userConquista1Semana = await findUserConquista(userId, conquista1Semana.id);
                if (!userConquista1Semana) {
                    await createUserConquista({
                        userId: userId,
                        conquistaId: conquista1Semana.id,
                        data: new Date()
                    });
                    console.log("Conquista de 1 semana criada com sucesso.");
                } else {
                    console.log("Usuário já possui a conquista de 1 semana.");
                }
            } else {
                console.log("Conquista de 1 semana não encontrada.");
            }
        }
        if (diasConcluidos >= 7) {
            const conquista1Semana = await findConquistaById(57);
            if (conquista1Semana) {
                const userConquista1Semana = await findUserConquista(userId, conquista1Semana.id);
                if (!userConquista1Semana) {
                    await createUserConquista({
                        userId: userId,
                        conquistaId: conquista1Semana.id,
                        data: new Date()
                    });
                    console.log("Conquista de 1 semana criada com sucesso.");
                } else {
                    console.log("Usuário já possui a conquista de 1 semana.");
                }
            } else {
                console.log("Conquista de 1 semana não encontrada.");
            }
        }

        // Conquista de 2 semanas consecutivas
        if (diasConcluidos >= 14) {
            const conquista2Semanas = await findConquistaById(56);
            if (conquista2Semanas) {
                const userConquista2Semanas = await findUserConquista(userId, conquista2Semanas.id);
                if (!userConquista2Semanas) {
                    await createUserConquista({
                        userId: userId,
                        conquistaId: conquista2Semanas.id,
                        data: new Date()
                    });
                    console.log("Conquista de 2 semanas seguidas criada com sucesso.");
                } else {
                    console.log("Usuário já possui a conquista de 2 semanas seguidas.");
                }
            } else {
                console.log("Conquista de 2 semanas seguidas não encontrada.");
            }
        }

        if (diasConcluidos >= 30) {
            const conquista1Mes = await findConquistaById(58);
            if (conquista1Mes) {
                const userConquista1Mes = await findUserConquista(userId, conquista1Mes.id);
                if (!userConquista1Mes) {
                    await createUserConquista({
                        userId: userId,
                        conquistaId: conquista1Mes.id,
                        data: new Date()
                    });
                    console.log("Conquista de 1 mês criada com sucesso.");
                } else {
                    console.log("Usuário já possui a conquista de 1 mês.");
                }
            } else {
                console.log("Conquista de 1 mês não encontrada.");
            }
        }
        if (diasConcluidos >= 365) {
            const conquista1Ano = await findConquistaById(59);
            if (conquista1Ano) {
                const userConquista1Ano = await findUserConquista(userId, conquista1Ano.id);
                if (!userConquista1Ano) {
                    await createUserConquista({
                        userId: userId,
                        conquistaId: conquista1Ano.id,
                        data: new Date()
                    });
                    console.log("Conquista de 1 ano criada com sucesso.");
                } else {
                    console.log("Usuário já possui a conquista de 1 ano.");
                }
            } else {
                console.log("Conquista de 1 ano não encontrada.");
            }
        }
        // Conquista de 3 dias de braço
        const completouTrêsDiasdeBraço = await exports.countUserStatus(userId, 'Costa');
        if (completouTrêsDiasdeBraço === 3) { // Verifica se o usuário completou 3 dias
            const conquistaBraço = await findConquistaById(52);
            if (conquistaBraço) { // Verifica se a conquista existe
                try {
                    // Tenta criar a conquista para o usuário
                    await createUserConquista({
                        userId: userId,
                        conquistaId: conquistaBraço.id,
                        data: new Date()
                    });
                    console.log("Conquista de 3 dias de costas criada com sucesso.");
                } catch (error) {
                    // Se o usuário já tiver a conquista, pode ignorar o erro ou fazer um log
                    console.log("A conquista de 3 dias de costas já pode estar presente ou ocorreu um erro ao criar a conquista:", error.message);
                }
            } else {
                console.log("Conquista de 3 dias de costas não encontrada.");
            }
        }

        const completouTrêsDiasdePerna = await exports.countUserStatus(userId, 'Pernas');
        if (completouTrêsDiasdePerna === 3) { // Verifica se o usuário completou 3 dias
            const conquistaBraço = await findConquistaById(53);
            if (conquistaBraço) { // Verifica se a conquista existe
                try {
                    // Tenta criar a conquista para o usuário
                    await createUserConquista({
                        userId: userId,
                        conquistaId: conquistaBraço.id,
                        data: new Date()
                    });
                    console.log("Conquista de 3 dias de pernas criada com sucesso.");
                } catch (error) {
                    // Se o usuário já tiver a conquista, pode ignorar o erro ou fazer um log
                    console.log("A conquista de 3 dias de pernas já pode estar presente ou ocorreu um erro ao criar a conquista:", error.message);
                }
            } else {
                console.log("Conquista de 3 dias de costas não encontrada.");
            }
        }

        //=====================================================================//
        return res.send({ message: "Treino concluído com sucesso!", createdStatus });
    } catch (error) {
        console.error("Erro:", error);
        res.status(500).send({ message: error.message });
    }
};
