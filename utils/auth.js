const resHandler = require('./resHandler')
const errHandler = require('./errHandler')

module.exports = (req, res, next) => {
    console.log('[AUTH]: session ID =', req.session.id)
    console.log('node_env', process.env.NODE_ENV)
    if (process.env.NODE_ENV !== 'production') return next()
    if (req.isAuthenticated()) {
        console.log('[AUTH]: Authenticated.')
        console.log()
        return next()
    }
    console.log('[AUTH]: Not Authenticated.')
    console.log()
    res.status(401).json(resHandler(null))
}