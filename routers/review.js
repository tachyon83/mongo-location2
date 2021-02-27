const router = require('express').Router()
const Review = require('../models/schemas/review')
const Word = require('../models/schemas/word')
const auth = require('../utils/auth')
const resHandler = require('../utils/resHandler')
const errHandler = require('../utils/errHandler')

router.post('/', async (req, res) => {
    let review = req.body.review.split(' ')
    for (let e of review) await Word.upsert(e)
    Review.add(req.body)
        .then(result => res.status(201).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.put('/', async (req, res) => {
    let prevReview = await Review.findOneById(req.body.reviewId)
    let review = prevReview.review.split(' ')
    for (let e of review) await Word.decreaseCnt(e)
    review = req.body.review.split(' ')
    for (let e of review) await Word.upsert(e)
    Review.updateById(req.body.reviewId, req.body)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.delete('/', (req, res) => {
    Review.deleteById(req.body.id)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/all/place/:contentId/:skip', (req, res) => {
    Review.findAllByPlace(req.params.contentId, req.params.skip)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/all/reviewer/:skip', (req, res) => {
    Review.findAllByReviewer(req.session.passport.user, req.params.skip)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/star/gte/:star/:skip', (req, res) => {
    Review.findByStarGte(req.params.star, req.params.skip)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/star/gte/place/:star/:contentId/:skip', (req, res) => {
    Review.findByStarGteAndPlace(req.params.star, req.params.contentId, req.params.skip)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/star/lte/place/:star/:contentId/:skip', (req, res) => {
    Review.findByStarLteAndPlace(req.params.star, req.params.contentId, req.params.skip)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/cnt/:contentId', (req, res) => {
    Review.countReviews(req.params.contentId)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/star/avg/:contentId', (req, res) => {
    Review.findStarAvg(req.params.contentId)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/star/best/:contentId', (req, res) => {
    Review.findTheBestByStar(req.params.contentId)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/star/worst/:contentId', (req, res) => {
    Review.findTheWorstByStar(req.params.contentId)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/keyword/cnt/:keyword', (req, res) => {
    Review.countByKeyword(req.params.keyword)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/keyword/list/:keyword/:skip/:cnt', (req, res) => {
    Review.findByKeyword(req.params.keyword, req.params.skip, req.params.cnt)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

module.exports = router
