const router = require('express').Router()
const User = require('../models/schemas/user')
const resHandler = require('../utils/resHandler')
const errHandler = require('../utils/errHandler')
const passport = require('passport');
const passportConfig = require('../configs/passportConfig')
passportConfig()

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json(errHandler(err))
        if (user) {
            // when using custom callback, need to use req.logIn()
            req.logIn(user, (err) => {
                if (err) return res.status(500).json(errHandler(err))
                console.log('[MEMBER]: login successful')
                console.log(req.session.passport)
                console.log()
                res.status(200).json(resHandler(true))
            })
        } else {
            console.log('[MEMBER]: login failed')
            console.log()
            res.status(200).json(resHandler(false))
        }
    })(req, res, next)
})

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

module.exports = router