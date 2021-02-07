const router = require('express').Router()
const Location = require('../models/schemas/location')
// const mongoose = require('mongoose')
const resHandler = require('../utils/resHandler')
const errHandler = require('../utils/errHandler')

router.get('/', (req, res) => {
    Location.findAll()
        .then(list => res.json(resHandler(list)))
        .catch(err => res.json(errHandler(err)))
})

router.get('/:name', (req, res) => {
    Location.findOneByName(req.params.name)
        .then(location => res.json(resHandler(location)))
        .catch(err => res.json(errHandler(err)))
})

router.post('/', (req, res) => {
    Location.add(req.body)
        // .then(result => res.json(resHandler(result)))
        .then(result => {
            console.log(result)
            res.redirect('/')
        })
        .catch(err => res.json(errHandler(err)))
})

router.put('/', (req, res) => {
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