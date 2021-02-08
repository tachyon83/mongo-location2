const router = require('express').Router()
const User = require('../models/schemas/user')
const resHandler = require('../utils/resHandler')
const errHandler = require('../utils/errHandler')
// const passport = require('passport');
const redisClient = require('../configs/redis/redisClient')
const passportAuthenticate = require('../configs/passport/passportAuthenticate')

router.get('/kakao/login', passportAuthenticate('kakao'))
router.get('/kakao/oauth', passportAuthenticate('kakao'))

router.post('/login', passportAuthenticate('local'))

router.post('/', (req, res) => {
    User.signUp(req.body)
        .then(result => res.status(201).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.put('/', (req, res) => {
    User.updateById(req.body)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.delete('/', (req, res) => {
    User.deleteById(req.body.id)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/logout', (req, res) => {
    try {
        redisClient.srem(process.env.redisOnlineUsers, req.session.passport.user)
        req.session.destroy(err => {
            if (err) res.status(500).json(errHandler(err))
            console.log('[MEMBER]: successfully logged out')
            console.log()
            res.status(200).json(resHandler(null))
        })
    } catch (err) {
        res.status(500).json(errHandler(err))
    }
})

module.exports = router