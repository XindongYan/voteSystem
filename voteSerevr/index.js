require('./mongoose/connection')();

const index = require('./controller/index');

const koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const rateLimit = require('koa2-ratelimit').RateLimit;

const { upload } = require('./utils/upload');

const params = require('./middlewear/params');
const auth = require('./middlewear/serverAuth');

const app = new koa();

app.use(cors());
// 限制一个ip十分钟间隔
const postPi = rateLimit.middleware({
    intercal: 10 * 60 * 1000,
    max: 1
})

app.use(bodyParser({
    enableTypes: ['json', 'form', 'text'],
    extendTypes: {
        text: ['text/xml', 'application/xml']
    },
}));

app.use(params());
app.use(require('koa-static')(path.join(__dirname, './public')));

const userRouter = new Router();

userRouter.all('/api/setNickName', index.setNickName);
// userRouter.all('/api/createA', index.createAdmin);
userRouter.all('/api/authBackend', index.authBackend);
userRouter.all('/api/upload', upload.single('image'), index.upload);

// 获取已发布的内容
userRouter.all('/api/getContetn', index.getPushContent);
// 更新已发布的内容
userRouter.all('/api/update', upload.single('image'), index.update);
// 删除内容
userRouter.all('/api/delete', index.delete);

// 投票
userRouter.all('/api/like', postPi, index.like);

app.use(userRouter.routes());

app.listen(3000);
console.log('port 3000 start')