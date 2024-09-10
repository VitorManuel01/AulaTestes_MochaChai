const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('aulateste', 'root', 'cimatec', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,  // Ajuste para número
    
    // Se necessário usar SSL, configure adequadamente
    // Em ambientes locais, SSL pode não ser necessário
    dialectOptions: {
        ssl: {
            require: false,  // Desative o SSL para desenvolvimento local
            rejectUnauthorized: false,
        },
    },
    logging: console.log,
});

// Teste a conexão para garantir que está funcionando
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
})();

module.exports = sequelize;