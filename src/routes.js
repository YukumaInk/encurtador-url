const express = require('express');
const Url = require('../database/connection');

const site = 'http://localhost:3434';

const routes = express.Router();

routes.post('/', async function(req,res){
    let{ originalUrl, name } = req.body;
    name = name.toLowerCase();
    try{
        const url = await Url.create({
            originalUrl: originalUrl,
            name: name,
            tinyUrl: `${site}/${name}`,
            numberOfVisits: 0,
            createdAt: Date.now(),
        });
        return res.json( await Url.findAll());
    } catch(e){
        if (e.name === 'SequelizeUniqueConstraintError') {
            return res.json('Esse nome ja esta sendo utilizado.');
        }
        return res.json('Algo deu errado.');
    }
});

routes.get('/', async function(req,res){
    const urlList = await Url.findAll()
    return res.json(urlList);
});

routes.get('/:urlName', async (req, res) => {
    const urlName = await Url.findOne({where: {name: req.params.urlName}});
    if(urlName == null) return res.sendStatus(404);
    Url.update({numberOfVisits: urlName.numberOfVisits + 1 }, {where: {name: urlName.name}});
    res.redirect(urlName.originalUrl);
    if(urlName.numberOfVisits>15) Url.destroy({ where: { name: urlName.name } });
});

routes.delete('/delete/:urlName', async function(req,res){
    const urlName = await Url.findOne({where: {name: req.params.urlName}});
    if(urlName == null) return res.sendStatus(404);
    Url.destroy({ where: { name: urlName.name } });
    return res.json('deletado');
});

 module.exports = routes;