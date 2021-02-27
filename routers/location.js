const router = require('express').Router()
const Location = require('../models/schemas/location')
const resHandler = require('../utils/resHandler')
const errHandler = require('../utils/errHandler')
// const fetch = require('node-fetch')
const request = require('request')
const locationItemsHandler = require('../models/utils/locationItemsHandler')


router.get('/keyword/:pageNo/:numOfRows/:keyword', (req, res) => {
    const url = process.env.openApiUrl_keywordBasedSearch + '?'
        + encodeURIComponent('ServiceKey') + '=' + process.env.ServiceKey
        + '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(req.params.pageNo)
        + '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(req.params.numOfRows)
        + '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent(process.env.MobileOS)
        + '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent(process.env.MobileApp)
        + '&' + encodeURIComponent('keyword') + '=' + encodeURIComponent(req.params.keyword)

    // fetch(url)
    //     .then(response => console.log(response))
    //     .catch(err => res.json(errHandler(err)))

    request({
        url,
        method: 'GET'
    }, (err, response, body) => {

        console.log('Status', response.statusCode);
        // console.log('Headers', JSON.stringify(response.headers));
        // console.log('body', body)

        if (err) return res.status(500).json(errHandler(err))
        if (response.statusCode !== 200) return res.status(500).json(resHandler(null))

        console.log(`[location Router]: Now handling location items found by keyword: ${req.params.keyword}...`)
        console.log()

        locationItemsHandler(req, body)
            .then(packet => res.status(200).json(resHandler(packet)))
            .catch(err => res.status(500).json(errHandler(err)))
    })
})

router.get('/:pageNo/:numOfRows/:mapX/:mapY/:radius', (req, res) => {
    if (req.params.mapX === 'null' || req.params.mapX === 'null') {
        console.log('bad request')
        return res.status(200).json(resHandler({
            totalCount: 0,
            items: [],
        }))
    }
    const url = process.env.openApiUrl_locationBasedSearch + '?'
        + encodeURIComponent('ServiceKey') + '=' + process.env.ServiceKey
        + '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(req.params.pageNo)
        + '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(req.params.numOfRows)
        + '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent(process.env.MobileOS)
        + '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent(process.env.MobileApp)
        + '&' + encodeURIComponent('mapX') + '=' + encodeURIComponent(req.params.mapX)
        + '&' + encodeURIComponent('mapY') + '=' + encodeURIComponent(req.params.mapY)
        + '&' + encodeURIComponent('radius') + '=' + encodeURIComponent(req.params.radius)

    // fetch(url)
    //     .then(response => console.log(response))
    //     .catch(err => res.json(errHandler(err)))

    // console.log(url)

    request({
        url,
        method: 'GET'
    }, (err, response, body) => {

        console.log('Open Api Response Status:', response.statusCode);
        // console.log('Headers', JSON.stringify(response.headers));
        // console.log('body', body)

        if (err) return res.status(500).json(errHandler(err))
        if (response.statusCode !== 200) return res.status(500).json(resHandler(null))

        console.log('[location Router]: Now handling location items...')
        // console.log(body)
        console.log()

        locationItemsHandler(req, body)
            .then(packet => res.status(200).json(resHandler(packet)))
            .catch(err => res.status(500).json(errHandler(err)))
    })
})

router.get('/ping', (req, res) => {
    res.status(200).json(resHandler('pong'))
})

router.get('/:name', (req, res) => {
    Location.findOneByName(req.params.name)
        .then(location => res.json(resHandler(location)))
        .catch(err => res.json(errHandler(err)))
})

router.post('/coordinates', (req, res) => {
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