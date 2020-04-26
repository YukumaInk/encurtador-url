const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database/database.sqlite',
});

const Url = sequelize.define('url', {
    originalUrl: Sequelize.STRING,
    name: {
        type: Sequelize.STRING,
        unique : true,
    },
    tinyUrl: Sequelize.STRING,
    numberOfVisits: Sequelize.INTEGER,
    createdAt: Sequelize.DATE,
});

Url.sync();

module.exports = Url;