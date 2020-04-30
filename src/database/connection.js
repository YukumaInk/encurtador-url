const Sequelize = require('sequelize');

const urlDb = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'src/database/storage.sqlite',
});

const userDb = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'src/database/storage.sqlite',
});

const Url = urlDb.define('url', {
    originalUrl: Sequelize.STRING,
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    tinyUrl: Sequelize.STRING,
    numberOfVisits: Sequelize.INTEGER,
    limitOfVisits: {
        type: Sequelize.INTEGER,
        defaultValue: 10,
    },
    imageUrl: Sequelize.STRING,
    userId: Sequelize.STRING,
    category: Sequelize.STRING,
    timeLimit: Sequelize.INTEGER,
});

const User = userDb.define('user', {
    id: {
        primaryKey: true,
        type: Sequelize.STRING,
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
    },
    email: Sequelize.STRING,
});

Url.sync();
User.sync();

module.exports = { Url, User };