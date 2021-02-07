const mongoose = require('mongoose')
const querySettings = require('../settings/querySettings')
// const parseUser = require('../utils/parseUser')
const bcrypt = require('bcrypt');
const saltRounds = 10

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        index: true,
        default: '',
        unique: true,
        required: true,
    },
    pw: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        // index: 'hashed',
        default: '',
        unique: true,
        required: true,
    },
    address: {
        type: String,
        default: '',
        unique: true,
    },
}, {
    timestamps: true,
})

userSchema.statics.signup = function (user) {
    bcrypt.genSalt(saltRounds).then(salt => {
        return bcrypt.hash(user.pw, salt)
    }).then(hash => {
        user.pw = hash
        return (new this(user)).save()
    }).catch(err => Promise.reject(err))
}
userSchema.statics.findAll = function (page) {
    return this.find({}).skip((page - 1) * querySettings.limitPerQuery).limit(querySettings.limitPerQuery)
}
userSchema.statics.findOneById = function (id) {
    return this.findOne({ id })
}
userSchema.statics.updateById = function (user) {
    return this.findOneAndUpdate({ id: users.id }, user, { new: true })
}
userSchema.statics.deleteById = function (id) {
    return this.remove({ id })
}

module.exports = mongoose.model('User', userSchema)