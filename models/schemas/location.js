const mongoose = require('mongoose')
const querySettings = require('../settings/querySettings')
const parsePayload = require('../utils/parseLocation')

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        index: 'hashed',
        default: '',
        unique: true,
        // required: true,
    },
    address: {
        type: String,
        default: '',
        unique: true,
    },
    position: {
        type: {
            type: String,
            default: 'Point',
        },
        // coords: [{ type: Number }],
        coordinates: [Number],
        // index: '2dsphere',
    },
}, {
    timestamps: true,
})
locationSchema.index({ position: '2dsphere' })
// it seems that 2dsphere index must be added like above, not in the schema definition.

locationSchema.statics.add = function (payload) {
    return (new this(parsePayload(payload))).save()
}
locationSchema.statics.findAll = function () {
    return this.find({}).limit(querySettings.limitPerQuery)
}
locationSchema.statics.findOneByName = function (name) {
    return this.findOne({ name })
}
locationSchema.statics.updateByName = function (name, payload) {
    return this.findOneAndUpdate({ name }, payload, { new: true })
}
locationSchema.statics.deleteByName = function (name) {
    return this.remove({ name })
}

locationSchema.statics.findNearest = function (lng, lat, maxDistance) {
    return this.find().where('position').near({
        center: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        // maxDistance: parseFloat(maxDistance),
        maxDistance,
    }).limit(1)
}

locationSchema.statics.findCircle = function (lng, lat, radius) {
    return this.find().where('position').within({
        center: [parseFloat(lng), parseFloat(lat)],
        radius: parseFloat(radius / querySettings.radiusConversion),
        unique: true,
        spherical: true
        // maxDistance: parseFloat(maxDistance),
    })
}

module.exports = mongoose.model('Location', locationSchema)