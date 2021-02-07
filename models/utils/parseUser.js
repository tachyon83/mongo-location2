module.exports = obj => {
    return {
        name: obj.name,
        address: obj.address,
        position: {
            coordinates: [parseFloat(obj.lng), parseFloat(obj.lat)]
        }
    }
}