const jwt = require('jsonwebtoken');

module.exports = function () {
    return function (ctx, next) {
        jwt.verify(ctx.headers.Authorization, 'salt-256', async function (error, callback) {
            if (error) {
                console.log(error)
            }
            console.log(callback)
            await next();
            return;
        })
    }
}