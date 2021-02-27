const router = require('express').Router()
const Word = require('../models/schemas/word')
const auth = require('../utils/auth')
const resHandler = require('../utils/resHandler')
const errHandler = require('../utils/errHandler')

router.get('/keywords/:num', (req, res) => {
    Word.findMost(req.params.num)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/keyword/:keyword', (req, res) => {
    Word.findByWord(req.params.keyword)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/cnt', (req, res) => {
    Word.countWords()
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

module.exports = router
