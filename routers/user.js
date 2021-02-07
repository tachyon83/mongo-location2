const router = require('express').Router()
const User = require('../models/schemas/User')
const resHandler = require('../utils/resHandler')
const errHandler = require('../utils/errHandler')
const passport = require('passport');
const passportConfig = require('../configs/passportConfig')
passportConfig()

// router.get('/', (req, res) => {
//     Location.findAll()
//         .then(list => res.json(resHandler(list)))
//         .catch(err => res.json(errHandler(err)))
// })

// router.get('/:name', (req, res) => {
//     Location.findOneByName(req.params.name)
//         .then(location => res.json(resHandler(location)))
//         .catch(err => res.json(errHandler(err)))
// })

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
    User.signup(req.body)
        .then(result => res.status(201).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.put('/', (req, res) => {
    User.updateById(req.body)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.delete('/:id', (req, res) => {
    User.deleteById(req.params.id)
        .then(result => res.status(204).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

module.exports = router