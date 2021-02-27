const mongoose = require('mongoose')
// const querySettings = require('../settings/querySettings')
// const nextIdIncrement = require('../utils/nextIdIncrement')

const wordSchema = new mongoose.Schema({
    word: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    cnt: {
        type: Number,
        required: true,
        default: 1,
        // index: true,
    },

}, {
    timestamps: true,
})

wordSchema.statics.upsert = function (word) {
    return this.findOneAndUpdate({ word }, {
        $inc: { cnt: 1 }
    }, {
        useFindAndModify: false,
        new: true,
    })
}
wordSchema.statics.findMost = function (num) {
    return this.find().sort({ cnt: -1 }).limit(num)
}
wordSchema.statics.findByWord = function (word) {
    return this.findOne({ word })
}
wordSchema.statics.decreaseCnt = function (word) {
    return this.findOneAndUpdate({
        word,
        cnt: { $gt: 1 },
    }, {
        $inc: { cnt: -1 },
    })
}
wordSchema.statics.countWords = function () {
    return this.find().countDocuments()
}

module.exports = mongoose.model('Word', wordSchema)