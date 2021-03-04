const mongoose = require('mongoose')
// const querySettings = require('../settings/querySettings')
// const nextIdIncrement = require('../utils/nextIdIncrement')

const reviewSchema = new mongoose.Schema({
    reviewId: {
        type: Number,
        unique: true,
        required: true,
        index: true,
    },
    contentId: {
        type: Number,
        // unique: true,
        required: true,
        // index: true,
    },
    reviewerId: {
        type: String,
        // index: true,
        // unique: true,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    star: {
        type: Number,
    },

}, {
    timestamps: true,
})

reviewSchema.statics.add = function (payload) {
    return new Promise(async (resolve, reject) => {
        try {
            const temp = await this.find().sort({ reviewId: -1 }).limit(1)
            payload.reviewId = temp[0].reviewId + 1
            resolve(await new this(payload).save())
        } catch (err) {
            reject(err)
        }

        // let flag = false
        // while (!flag) {
        //     try {
        //         payload.reviewId = await nextIdIncrement('review')
        //     } catch (err) {
        //         return reject(err)
        //     }
        //     try {
        //         let result = await new this(payload).save()
        //         flag = true
        //         return resolve(result)
        //     } catch (err) {
        //         console.log('[Schema]: Duplicate Key...need to increment the ReviewId.')
        //         // console.log(err)
        //     }
        // }
    })
}

reviewSchema.statics.findAllByPlace = function (contentId, skip, cnt) {
    return this.find({ contentId }).skip(skip).limit(cnt)
}
reviewSchema.statics.findAllByReviewer = function (reviewerId, skip, cnt) {
    return this.find({ reviewerId }).skip(skip).limit(cnt)
}
reviewSchema.statics.findOneById = function (reviewId) {
    return this.findOne({ reviewId })
}
// reviewSchema.statics.findOneByPlace = function (contentId) {
//     return this.findOne({ contentId })
// }

// need auth
reviewSchema.statics.updateById = function (reviewId, payload) {
    return this.findOneAndUpdate({ reviewId }, payload, {
        useFindAndModify: false,
        new: true,
    })
}
// need auth
reviewSchema.statics.deleteById = function (reviewId) {
    return this.remove({ reviewId })
}

reviewSchema.statics.findByStarGte = function (star, skip, cnt) {
    return this.find({ star: { $gte: star } }).skip(skip).limit(cnt)
}
reviewSchema.statics.findByStarGteAndPlace = function (star, contentId, skip, cnt) {
    return this.find({ contentId, star: { $gte: star } }).skip(skip).limit(cnt)
}
reviewSchema.statics.findByStarLteAndPlace = function (star, contentId, skip, cnt) {
    return this.find({ contentId, star: { $lte: star } }).skip(skip).limit(cnt)
}
reviewSchema.statics.countReviews = function (contentId) {
    return this.find({ contentId }).countDocuments()
}
reviewSchema.statics.findStarAvg = function (contentId) {
    return this.aggregate([
        { $match: { contentId, } },
        {
            $group: {
                _id: null,
                average: { $avg: '$star' },
            }
        }
    ])
}
reviewSchema.statics.findTheBestByStar = function (contentId) {
    return this.find({ contentId }).sort({ star: -1 }).limit(1)
}
reviewSchema.statics.findTheWorstByStar = function (contentId) {
    return this.find({ contentId }).sort({ star: 1 }).limit(1)
}

reviewSchema.statics.countByKeyword = function (keyword) {
    return this.find({
        review: {
            '$regex': keyword,
            '$options': 'i'
        }
    }).countDocuments()
}
reviewSchema.statics.findByKeyword = function (keyword, skip, cnt) {
    return this.find({
        review: {
            '$regex': keyword,
            '$options': 'i'
        }
    }).skip(skip).limit(cnt)
}

module.exports = mongoose.model('Review', reviewSchema)