const mongoose = require('mongoose')
const querySettings = require('../settings/querySettings')
// const nextIdIncrement = require('../utils/nextIdIncrement')

const locationSchema = new mongoose.Schema({
    contentId: {
        type: Number,
        unique: true,
        required: true,
        index: true,
    },
    facltNm: {
        type: String,
        index: 'hashed',
        // default: '',
        required: true,
    },
    lineIntro: {
        type: String,
        // index: 'hashed',
        // default: '',
        required: true,
    },
    intro: {
        type: String,
        required: true,
    },
    hvofBgnde: {
        type: String,
    },
    hvofEnddle: {
        type: String,
    },
    featureNm: {
        type: String,
    },
    induty: {
        type: String,
    },
    lctCl: {
        type: String,
    },
    doNm: {
        type: String,
    },
    sigunguNm: {
        type: String,
    },
    addr1: {
        type: String,
    },
    addr2: {
        type: String,
    },
    direction: {
        type: String,
    },
    tel: {
        type: String,
    },
    homepage: {
        type: String,
    },
    exprnProgrm: {
        type: String,
    },
    eqpmnLendCl: {
        type: String,
    },
    animalCmgCl: {
        type: String,
    },
    tourEraCl: {
        type: String,
    },
    firstImageUrl: {
        type: String,
    },
    position: {
        type: {
            type: String,
            default: 'Point',
        },
        // required: true,
        coordinates: [Number],
        // index: '2dsphere',
    },
}, {
    timestamps: true,
})
locationSchema.index({ position: '2dsphere' })
// it seems that 2dsphere index must be added like above, not in the schema definition.


locationSchema.statics.add = function (payload) {
    return new Promise(async (resolve, reject) => {
        try {
            const temp = await this.find().sort({ contentId: -1 }).limit(1)
            payload.contentId = temp[0].contentId + 1
            resolve(await new this(payload).save())
        } catch (err) {
            reject(err)
        }

        // let flag = false
        // while (!flag) {
        //     try {
        //         payload.contentId = await nextIdIncrement('content')
        //     } catch (err) {
        //         return reject(err)
        //     }
        //     try {
        //         let result = await new this(payload).save()
        //         flag = true
        //         return resolve(result)
        //     } catch (err) {
        //         console.log('[Schema]: Duplicate Key...need to increment the contentId.')
        //         // console.log(err)
        //     }
        // }
    })
}

// locationSchema.statics.findAll = function () {
//     return this.find({}).limit(querySettings.limitPerQuery)
// }
locationSchema.statics.findOneByName = function (facltNm) {
    return this.findOne({ facltNm })
}
locationSchema.statics.updateByName = function (facltNm, payload) {
    return this.findOneAndUpdate({ facltNm }, payload, {
        useFindAndModify: false,
        new: true,
    })
}
locationSchema.statics.deleteByName = function (facltNm) {
    return this.remove({ facltNm })
}

locationSchema.statics.findNearest = function (lng, lat, maxDistance) {
    return this.find().where('position').near({
        center: {
            type: 'Point',
            // coordinates: [parseFloat(lng), parseFloat(lat)]
            coordinates: [lng, lat]
        },
        // maxDistance: parseFloat(maxDistance),
        maxDistance,
    }).limit(1)
}

locationSchema.statics.findByKeywordCount = function (keyword) {
    return this.find({
        facltNm: {
            '$regex': keyword,
            '$options': 'i'
        }
    }).countDocuments()
}
locationSchema.statics.findByKeyword = function (keyword, skip, cnt) {
    return this.find({
        facltNm: {
            '$regex': keyword,
            '$options': 'i'
        }
    }).skip(skip).limit(cnt)
}

locationSchema.statics.findCircleCount = function (lng, lat, radius) {
    return this.find().where('position').within({
        center: [parseFloat(lng), parseFloat(lat)],
        // center: [lng, lat],
        radius: parseFloat(radius) / querySettings.radiusConversion,
        unique: true,
        spherical: true
        // maxDistance: parseFloat(maxDistance),
    }).countDocuments()
}

locationSchema.statics.findCircle = function (lng, lat, radius, skip, cnt) {
    return this.find().where('position').within({
        center: [parseFloat(lng), parseFloat(lat)],
        // center: [lng, lat],
        radius: parseFloat(radius) / querySettings.radiusConversion,
        unique: true,
        spherical: true
        // maxDistance: parseFloat(maxDistance),
    }).skip(skip).limit(cnt)
}

module.exports = mongoose.model('Location', locationSchema)