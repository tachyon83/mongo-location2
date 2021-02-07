const mongooseConnect = require('./models/mongooseConnect')
const Location = require('./models/schemas/location')
const proj4 = require('proj4')
const fs = require('fs');
require('dotenv').config()

proj4.defs["EPSG:2097"] = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43"
const tm2097 = proj4.Proj(proj4.defs["EPSG:2097"])
const wgs84 = proj4.Proj(proj4.defs["EPSG:4326"]); //경위도 

fs.readFile('./sources/mapo.json', 'utf8', async (error, jsonFile) => {
    if (error) return console.log(error);

    await mongooseConnect()

    const dataArr = (JSON.parse(jsonFile)).DATA;
    console.log('howMany: ', dataArr.length)

    // forEach does not return anything. 
    // when wrapping array handler with promise, make sure the handler returns something!
    // await Promise.all(dataArr.forEach(data => {
    await Promise.all(dataArr.map(async data => {
        if (!data.x || !data.y) return

        let obj = {}
        obj.name = data.bplcnm
        obj.address = data.sitewhladdr

        // console.log([data.x, data.y])
        let p = proj4.toPoint([parseFloat(data.x), parseFloat(data.y)]);
        p = proj4.transform(tm2097, wgs84, p);
        obj.lng = p.x
        obj.lat = p.y

        await Location.add(obj)
            .then(_ => console.log('successfully registered'))
            .catch(err => console.log(err))
    }))
        .catch(err => console.log(err))
    console.log('mapo data insertion complete!')
});