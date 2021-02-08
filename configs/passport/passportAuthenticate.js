const passport = require('passport');
const resHandler = require('../../utils/resHandler')
const errHandler = require('../../utils/errHandler')

module.exports = strategy => {
    return (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
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
    }
}