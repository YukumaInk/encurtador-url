const express = require('express');
const db = require('../database/connection');
const crypto = require('crypto');

const site = 'http://localhost:3434';

const routes = express.Router();

routes.get('/', async function(req, res) {
    res.render('index');
});

routes.get('/user/:username', async(req, res) => {
    const username = req.params.username;
    const user = await db.User.findOne({ where: { username: username } });
    const urlList = await db.Url.findAll({ where: { userId: user.id } });
    res.render('user', { urlList: urlList, username: username });
});

routes.post('/user/:username', async(req, res) => {
    const username = req.params.username;
    const user = await db.User.findOne({ where: { username: username } });
    let originalUrl = req.body.originalUrl;
    let name = req.body.name;
    name = name.toLowerCase();
    try {
        const url = await db.Url.create({
            originalUrl: originalUrl,
            name: name,
            tinyUrl: `${site}/${name}`,
            numberOfVisits: 0,
            createdAt: Date.now(),
            userId: user.id,
        });
        return res.redirect(`/user/${username}`);
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return res.json('Esse nome ja esta sendo utilizado.');
        }
        return res.json('Algo deu errado.');
    }
});

routes.get('/list/:username', async(req, res) => {
    const username = req.params.username;
    const user = await db.User.findOne({ where: { username: username } });
    if (username == 'alluser') {
        const userList = await db.User.findAll()
        return res.json(userList);
    } else if (username == 'allurl') {
        const urlList = await db.Url.findAll()
        return res.json(urlList);
    } else if (user == null) return res.sendStatus(404);
    const urlList = await db.Url.findAll({ where: { userId: user.id } });
    return res.json(urlList);
});

routes.post('/create/user', async function(req, res) {
    let { username, email, password } = req.body;
    try {
        const user = await db.User.create({
            username: username,
            email: email,
            password: password,
            id: crypto.randomBytes(4).toString('HEX'),
        });
        return res.redirect(`/user/${username}`);
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return res.json('Esse nome ja esta sendo utilizado.');
        }
        return res.json('Algo deu errado.');
    }
});

routes.get('/create/user', function(req, res) {
    res.render('createUser');
});

routes.get('/:urlName', async(req, res) => {
    const urlName = await db.Url.findOne({ where: { name: req.params.urlName } });
    if (urlName == null) return res.sendStatus(404);
    db.Url.update({ numberOfVisits: urlName.numberOfVisits + 1 }, { where: { name: urlName.name } });
    res.redirect(urlName.originalUrl);
    if (urlName.numberOfVisits > 15) db.Url.destroy({ where: { name: urlName.name } });
});

routes.get('/delete/:urlName', async(req, res) => {
    const urlName = await db.Url.findOne({ where: { name: req.params.urlName } });
    const user = await db.User.findOne({ where: { id: urlName.userId } });
    if (urlName == null) return res.sendStatus(404);
    db.Url.destroy({ where: { name: urlName.name } });
    return res.redirect(`/user/${user.username}`);
});

module.exports = routes;