const convert = require('xml-js')
const parseLocationDto = require('./parseLocationDto')
const Location = require('../schemas/location')

module.exports = (req, body) => {
    return new Promise(async (resolve, reject) => {

        // xml2json converts xml into json text, so need to parse the string.
        const converted = JSON.parse(convert.xml2json(body, { compact: true, spaces: 2 }))

        // openApi에서 나온 정보가 우선한다. 이후에 local db정보를 가져온다.
        let totalCount = parseInt(converted.response.body.totalCount._text)
        console.log('total from openApi', totalCount)
        let totalFromOpenApi = totalCount
        let totalFromLocalDb = 0

        try {
            totalFromLocalDb = await Location.findCircleCount(req.params.mapX, req.params.mapY, req.params.radius)
            console.log('totalFromLocalDb', totalFromLocalDb)
            totalCount += totalFromLocalDb
        } catch (err) {
            return reject(err)
        }

        // 배열 비어있을 때, undefined
        // 배열의 길이가 1이면, 배열이 아님. 객체가 온다...
        if (converted.response.body.items.item) {
            if (converted.response.body.items.item.length) {
                converted.response.body.items.item = converted.response.body.items.item.map(e => parseLocationDto(e))
            } else {
                converted.response.body.items.item = [parseLocationDto(converted.response.body.items.item)]
            }
        } else {
            converted.response.body.items.item = []
        }
        // console.log(converted.response.body.items.item)

        let pageNo = parseInt(req.params.pageNo)
        let numOfRows = parseInt(req.params.numOfRows)

        if (pageNo * numOfRows > totalFromOpenApi) {
            let maxPage = parseInt(totalCount / numOfRows)
            maxPage = (totalCount % numOfRows) ? maxPage + 1 : maxPage
            let diff = pageNo * numOfRows - totalFromOpenApi
            let skip = 0
            if (pageNo > maxPage) {
                return resolve({
                    totalCount,
                    // items: converted.response.body.items.item,
                    items: [],
                })
            }
            if (diff > numOfRows) {
                skip = (pageNo - 1) * numOfRows - totalFromOpenApi
                diff -= skip
            }

            try {
                let listFromLocalDb = await Location.findCircle(req.params.mapX, req.params.mapY, req.params.radius, skip, diff)
                converted.response.body.items.item = converted.response.body.items.item.concat(listFromLocalDb)
            } catch (err) {
                return reject(err)
            }
            return resolve({
                totalCount,
                items: converted.response.body.items.item,
            })

        } else return resolve({
            totalCount,
            items: converted.response.body.items.item,
        })
    })
}
