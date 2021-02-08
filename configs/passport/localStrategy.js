const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/schemas/user')

module.exports = passport => {
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pw',
        session: true, //세션에 저장 여부
        passReqToCallback: true,
    }, (req, id, pw, done) => {
        User.findOneById(id)
            .then(user => {
                if (user) {
                    bcrypt.compare(pw, user.pw, (err, res) => {
                        if (err) return done(err, false)
                        if (res) return done(null, user)
                        else return done(null, false)
                    })
                }
                else return done(null, false)
            })
            .catch(err => done(err, false))
    }))
}