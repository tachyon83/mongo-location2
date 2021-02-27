const redisClient = require('../../configs/redis/redisClient')

module.exports = key => {
    return new Promise((resolve, reject) => {
        switch (key) {
            case 'content':
                key = process.env.redisNextContentIdKey
                break;

            case 'review':
                key = process.env.redisNextReviewIdKey
                break;

            default:
                break;
        }
        redisClient.get(key, (err, id) => {
            if (err) return reject(err)
            redisClient.set(key, (parseInt(id) + 1).toString())
            return resolve(parseInt(id))
        })
    })
}