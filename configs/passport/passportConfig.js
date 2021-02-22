const redisClient = require('../redis/redisClient')
const localStrategy = require('./localStrategy')
const kakaoStrategy = require('./kakaoStrategy')

module.exports = passport => {
    // serializeUser and deserializeUser are both required for passport to work

    // this first variable in this 'serialize' function becomes
    // the key of req.session.passport.[key] <=== ???
    // in this case, 'user' 

    passport.serializeUser((user, done) => {
        // when done, req.session.passport.user에 저장!
        redisClient.sadd(process.env.redisOnlineUsers, user.id)
        console.log('[PASSPORT]: Now Being Serialized')
        console.log()
        if (user) return done(null, user.id);
        return done(null, null)
    })

    passport.deserializeUser((id, done) => {
        // at first, req.session.passport is not defined
        // through this 'deserialize' process, passport is attached

        // console.log('session', req.session) <-undefined at this point
        // console.log('deserialize called and req.user is registered')

        redisClient.sismember(process.env.redisOnlineUsers, id, (err, res) => {
            if (err) return done(err, null)
            console.log('[PASSPORT]: Now Being Deserialized')
            console.log()
            return done(null, res ? id : null)
        })
        // User.findOneById(id)
        //     .then(user => done(null, user ? id : null))
        //     .catch(err => done(err, null))

        // now user is registered into req.user
        // Cookie 의 secure 설정이 true 인 경우 deserialize불가
        // 세션 스토어 쿠키 객체의 secure 값을 false-> 해결
    })

    localStrategy(passport)
    kakaoStrategy(passport)
}