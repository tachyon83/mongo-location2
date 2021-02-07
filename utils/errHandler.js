const resHandler = require('./resHandler')

module.exports = err => {
    console.log('[ERROR]:', err)
    return resHandler(null)
}