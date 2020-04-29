const db = require('../database/connection');
const axios = require('axios');
const crypto = require('crypto');

module.exports = {
    async create(req,res){
        let { name, limit, originalUrl, category, timeLimit } = req.body;
        const userId = req.params.userId;
        if(userId == 'nouser'){
            limit = 10;
            timeLimit = 5;
        }
        name = name.toLowerCase();
        let isValidUrl, imageUrl;
        try{
            isValidUrl = await axios.get(`${originalUrl}`);
            imageUrl = await axios.get(`https://www2png.com/api/capture/4fb4218a-b79f-41a8-818c-0c316697508d?url=${originalUrl}`);
        } catch(e){
            return res.sendStatus(406);//url invalida
        }
        try {
            const url = await db.Url.create({
                id: crypto.randomBytes(6).toString('HEX'),
                originalUrl: originalUrl,
                name: name,
                tinyUrl: `http://localhost:3434/${name}`,
                numberOfVisits: 0,
                limitOfVisits: limit,
                userId: userId,
                imageUrl: imageUrl.data.image_url,
                category: category,
                timeLimit: timeLimit,
            });
            if(timeLimit!=0){
                async function deleteByTime(name){
                   await db.Url.destroy({ where: {name: name}});
                }
                setTimeout(deleteByTime, timeLimit*60000, name);
            }
            return res.json(await db.Url.findAll({ where: { name: name } }));
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return res.sendStatus(404);//mesmo nome
            }
            return res.sendStatus(400);
        }
    },
    async redirectUrl(req,res){
        const urlName = await db.Url.findOne({ where: { name: req.params.urlName } });
        if (urlName == null) return res.sendStatus(404);
        db.Url.update({ numberOfVisits: urlName.numberOfVisits + 1 }, { where: { name: urlName.name } });
        res.redirect(urlName.originalUrl);
        if (urlName.numberOfVisits > parseInt(urlName.limitOfVisits)) db.Url.destroy({ where: { name: urlName.name } });
    },
    async delete(req,res){
        const urlName = await db.Url.findOne({ where: { name: req.params.urlName } });
        const user = await db.User.findOne({ where: { id: req.params.userId } });
        if (urlName == null || user==null) return res.sendStatus(404);//nao encontrado
        else if(urlName.userId!=user.id) return res.sendStatus(401);//nao autorizado
        else {
            db.Url.destroy({ where: { name: urlName.name } });
            return res.sendStatus(200);
        }
    }
};