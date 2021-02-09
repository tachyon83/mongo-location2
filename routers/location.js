const router = require('express').Router()
const Location = require('../models/schemas/location')
const resHandler = require('../utils/resHandler')
const errHandler = require('../utils/errHandler')
const parseLocationDto = require('../models/utils/parseLocationDto')
// const fetch = require('node-fetch')
const request = require('request')
const convert = require('xml-js')

router.get('/:pageNo/:numOfRows/:mapX/:mapY/:radius', (req, res) => {
    const url = `${process.env.openApiUrl}?ServiceKey=${process.env.ServiceKey}&pageNo=${req.params.pageNo}&numOfRows=${req.params.numOfRows}&MobileOS=${process.env.MobileOS}&MobileApp=${process.env.MobileApp}&mapX=${req.params.mapX}&mapY=${req.params.mapY}&radius=${req.params.radius}`

    // fetch(url)
    //     .then(response => console.log(response))
    //     .catch(err => res.json(errHandler(err)))

    request({
        url,
        method: 'GET'
    }, async (err, response, body) => {

        // console.log('Status', response.statusCode);
        // console.log('Headers', JSON.stringify(response.headers));

        if (err) return res.status(500).json(errHandler(err))
        if (response.statusCode !== 200) return res.status(500).json(resHandler(null))

        // xml2json converts xml into json text, so need to parse the string.
        const converted = JSON.parse(convert.xml2json(body, { compact: true, spaces: 2 }))

        // openApi에서 나온 정보가 우선한다. 이후에 local db정보를 가져온다.
        let totalCount = converted.response.body.totalCount
        try {
            totalCount += await Location.findCircleCount(req.params.mapX, req.params.mapY, req.params.radius)
        } catch (err) {
            res.status(500).json(errHandler(err))
        }

        converted.response.body.items.item.map(e => parseLocationDto(e))

        let l = converted.response.body.items.item.length
        let numOfRows = parseInt(req.params.numOfRows)
        if (l < numOfRows) {
            let diff = numOfRows - l
            await Location.findCircle(req.params.mapX, req.params.mapY, req.params.radius, diff)
        }
        res.status(200).json(resHandler(converted.response.body.items.item.length))
    })

    // Location.findAll()
    //     .then(list => res.json(resHandler(list)))
    //     .catch(err => res.json(errHandler(err)))
})

router.get('/:name', (req, res) => {
    Location.findOneByName(req.params.name)
        .then(location => res.json(resHandler(location)))
        .catch(err => res.json(errHandler(err)))
})

router.post('/', (req, res) => {
    Location.add(req.body)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.put('/', (req, res) => {
    // need to be careful when changing only selected values
    Location.updateByName(req.body.name, req.body)
        .then(result => res.json(resHandler(result)))
        .catch(err => res.json(errHandler(err)))
})

router.delete('/:name', (req, res) => {
    Location.deleteByName(req.params.name)
        .then(result => res.json(resHandler(result)))
        .catch(err => res.json(errHandler(err)))
})

router.post('/findNearest', (req, res) => {
    Location.findNearest(req.body.lng, req.body.lat, req.body.maxDistance)
        // .then(list => res.json(resHandler(list)))
        .then(list => {
            console.log(list)
            res.redirect('/')
        })
        .catch(err => res.json(errHandler(err)))
})

router.post('/findCircle', (req, res) => {
    Location.findCircle(req.body.lng, req.body.lat, req.body.radius)
        // .then(list => res.json(resHandler(list)))
        .then(list => {
            console.log(list)
            res.redirect('/')
        })
        .catch(err => res.json(errHandler(err)))
})

module.exports = router