const Sequelize = require('sequelize');

const urlDb = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database/urls.sqlite',
});

const userDb = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database/users.sqlite',
});

const Url = urlDb.define('url', {
    originalUrl: Sequelize.STRING,
    name: {
        type: Sequelize.STRING,
        unique : true,
    },
    tinyUrl: Sequelize.STRING,
    numberOfVisits: Sequelize.INTEGER,
    userId: Sequelize.STRING,
    createdAt: Sequelize.DATE,
});

const User = userDb.define('user',{
    id: {
        primaryKey:true,
        type: Sequelize.STRING,
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
    },
    password: Sequelize.STRING,
    email: Sequelize.STRING,
});

Url.sync();
User.sync();
//
module.exports = {Url, User};