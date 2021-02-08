const redisClient = require('../../configs/redis/redisClient')

module.exports = _ => {
    return new Promise((resolve, reject) => {
        redisClient.get(process.env.redisNextContentIdKey, (err, id) => {
            if (err) return reject(err)
            redisClient.set(process.env.redisNextContentIdKey, (parseInt(id) + 1).toString())
            return resolve(parseInt(id))
        })
    })
}