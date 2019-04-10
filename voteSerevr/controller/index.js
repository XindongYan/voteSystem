const { userModel, adminModel } = require('../models/userModel');
const { contentModel } = require('../models/contentModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
    createAdmin: async (ctx, next) => {
        const username = "admin", password = "QAZWSX123";
        const hash = crypto.createHmac('sha256', 'slat-256').update(password).digest('hex');

        let admin = await adminModel.findOneAndUpdate({ username }, { password: hash });
        if (!admin) {
            let user = new adminModel({
                username: username,
                password: hash
            });

            try {
                await user.save();
            } catch (error) {
                throw error;
            };
        };

        ctx.body = true;
    },

    authBackend: async (ctx, next) => {
        let { username, password } = ctx.params;
        password = crypto.createHmac('sha256', 'slat-256').update(password).digest('hex');
        let admin = await adminModel.findOne({ username, password });
        if (admin) {
            let token = jwt.sign({
                exp: Date.now() / 1000 + (60 * 60 * 3),
                data: {
                    username, password
                }
            }, 'salt-256');

            ctx.body = {
                token: token
            };
        } else {
            throw '登陆信息有误';
        }
    },

    setNickName: async (ctx, next) => {
        let { nickName } = ctx.params;
        let user = await userModel.findOne({ nickName });
        if (user) {
            throw '昵称已存在'
        }

        user = new userModel({
            nickName: nickName
        });

        try {
            await user.save();
        } catch (error) {
            throw error;
        };

        ctx.body = { nickName };
    },

    // 处理上传文件
    upload: async (ctx, next) => {
        let content = {};

        try {

            if (ctx.req && ctx.req.file) {
                let content = {};

                const fileMsg = ctx.req.file;

                const fileName = fileMsg.filename;
                content.imageUrl = `/images/${fileName}`;

                let contentCraete = new contentModel(content);
                contentCraete = await contentCraete.save();
                if (!contentCraete) {
                    throw '上传失败'
                };

                ctx.body = {
                    imageUrl: contentCraete.imageUrl,
                    _id: contentCraete._id
                }
            } else {
                const { name, school, desc, _id } = ctx.params;

                let contentCraete = await contentModel.findByIdAndUpdate({ _id: _id }, { name, school, desc }, { new: true })

                if (!contentCraete) {
                    throw '存储失败'
                };

                ctx.body = {
                    msg: '上传成功',
                    name: contentCraete.name,
                    school: contentCraete.school,
                    desc: contentCraete.desc
                }
            };


        } catch (error) {
            throw error
        }
    },

    getPushContent: async (ctx, next) => {
        let content = await contentModel.find({}).sort({ 'createdAt': -1 });

        ctx.body = {
            content
        }
    },

    like: async (ctx, next) => {
        let { id } = ctx.params;
        let likes

        try {
            likes = await contentModel.findOneAndUpdate({ _id: id }, { $inc: { like: 1 } }, { new: true });
            if (!likes) {
                console.log(likes)
                throw '记录不存在'
            }
        } catch (error) {
            throw error;
        }


        ctx.body = likes;
    },

    update: async (ctx, next) => {
        try {

            if (ctx.req && ctx.req.file) {
                let content = {};
                const { id } = ctx.req.body;
                console.log('更新图片');
                console.log(id);

                const fileMsg = ctx.req.file;

                const fileName = fileMsg.filename;
                content.imageUrl = `/images/${fileName}`;

                let result = await contentModel.findByIdAndUpdate({ _id: id }, { $set: { imageUrl: `/images/${fileName}` } }, { new: true });
                // let contentCraete = new contentModel(content);
                // contentCraete = await contentCraete.save();
                if (!result) {
                    throw '上传失败'
                };

                ctx.body = {
                    imageUrl: result.imageUrl
                }
            } else {
                console.log('更新内容')
                const { name, school, desc, id } = ctx.params;
                console.log(ctx.request);

                let contentCraete = await contentModel.findByIdAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            name, school, desc
                        }
                    },
                    { new: true })

                if (!contentCraete) {
                    throw '存储失败'
                };

                ctx.body = {
                    msg: '上传成功',
                    name: contentCraete.name,
                    school: contentCraete.school,
                    desc: contentCraete.desc
                }
            };


        } catch (error) {
            throw error
        }
    },

    delete: async (ctx, next) => {
        try {
            await contentModel.findByIdAndRemove({ _id: ctx.params._id });
        } catch (error) {

        }
        let content = await contentModel.find({}).sort({ 'createdAt': -1 });

        ctx.body = {
            content
        }
    }
}