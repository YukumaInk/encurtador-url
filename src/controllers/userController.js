const db = require('../database/connection');
const crypto = require('crypto');

module.exports ={
    async create(req,res){
        let { username, email } = req.body;
        try {
            const user = await db.User.create({
                username: username,
                email: email,
                id: crypto.randomBytes(4).toString('HEX'),
            });
            return res.json(user.id);
        } catch (e) {
            if (e.username === 'SequelizeUniqueConstraintError') {
                return res.sendStatus(404);
            }
            return res.sendStatus(400);
        }
    },
    async list(req,res){
        const userId = req.params.userId;
        if(userId == 'alluser')return res.json(await db.User.findAll());
        if(userId == 'allurl')return res.json(await db.Url.findAll());
        const user = await db.User.findOne({ where: { id: userId } });
        const urlList = await db.Url.findAll({ where: { userId: user.id } });
        res.json(urlList);
    },
    async listByCategory(req,res){
        const userId = req.params.userId;
        const category = req.params.category;
        const user = await db.User.findOne({where:{id:userId}});
        const list = await db.Url.findAll({where:{userId: user.id, category:category}});
        res.json(list);
    },
}
