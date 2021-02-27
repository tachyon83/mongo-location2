const mongoose = require('mongoose')
const querySettings = require('../settings/querySettings')
const encode = require('../../utils/encode')

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        index: true,
        // default: '',
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
        required: true,
    },
    address: {
        type: String,
        default: '',
        unique: true,
    },
    provider: {
        type: String,
        default: '',
    }
}, {
    timestamps: true,
})

userSchema.statics.signUp = function (user) {
    return new Promise((resolve, reject) => {
        encode(user.pw)
            .then(hash => {
                user.pw = hash
                resolve((new this(user)).save())
            })
            .catch(err => reject(err))
    })
}
userSchema.statics.findAll = function (page) {
    return this.find({}).skip((page - 1) * querySettings.limitPerQuery).limit(querySettings.limitPerQuery)
}
userSchema.statics.findOneById = function (id) {
    return this.findOne({ id })
}
userSchema.statics.updateById = function (user) {
    // return new Promise((resolve, reject) => {
    //     bcrypt.genSalt(saltRounds)
    //         .then(salt => bcrypt.hash(user.pw, salt))
    //         .then(hash => {
    //             user.pw = hash
    //             resolve(this.findOneAndUpdate({ id: user.id }, user, {
    //                 useFindAndModify: false,
    //                 new: true
    //             }))
    //         })
    //         .catch(err => reject(err))
    // })
    return this.findOneAndUpdate({ id: user.id }, {
        address: user.address,
        name: user.name,
    }, {
        useFindAndModify: false,
        new: true
    })
}
userSchema.statics.deleteById = function (id) {
    // return this.remove({ id })
    return this.deleteOne({ id })
}

module.exports = mongoose.model('User', userSchema)