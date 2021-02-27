// connect-redis version must be somewhere around 3.#.#
// now upgraded to 5.0.0
const redis = require('redis')
const redisSetting = require('./redisSetting')
const redisClient = redis.createClient(process.env.REDIS_URL || { port: redisSetting.port, host: redisSetting.host })

// ***********************   to use in heroku   ***********************
// const heroku_redis_password = 'pa1fa3945bc6286338291f048bd62b3987813248b28bd3af99c34b53e40563ddd'
// redisClient.auth(heroku_redis_password, function (err) {
//     if (err) throw err
// })
// *********************** *********************** ***********************

// redisClient.auth(redisSetting.password, function (err) {
//     console.log('redis authorized')
//     if (err) throw err
// })
redisClient.on('error', function (err) {
    console.log('[REDIS]: Error Occurred:' + err)
    console.log()
})

redisClient.get(process.env.redisNextContentIdKey, (err, id) => {
    if (err) console.log(err)
    else if (!id) redisClient.set(process.env.redisNextContentIdKey, process.env.redisNextContentId)
})
redisClient.get(process.env.redisNextReviewIdKey, (err, id) => {
    if (err) console.log(err)
    else if (!id) redisClient.set(process.env.redisNextReviewIdKey, process.env.redisNextReviewId)
})

module.exports = redisClient