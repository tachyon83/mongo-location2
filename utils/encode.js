const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = sth => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds)
            .then(salt => bcrypt.hash(sth, salt))
            .then(resolve)
            .catch(reject)
    })
}