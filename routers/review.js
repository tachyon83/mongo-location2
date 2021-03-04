const router = require('express').Router()
const Review = require('../models/schemas/review')
const Word = require('../models/schemas/word')
const auth = require('../utils/auth')
const resHandler = require('../utils/resHandler')
const errHandler = require('../utils/errHandler')
const skipCntFinder = require('../utils/skipCntFinder')

router.post('/', auth, async (req, res) => {
    let review = req.body.review.split(' ')
    try {
        req.body.reviewerId = req.session.passport.user
        let result = await Review.add(req.body)
        for (let e of review) await Word.upsert(e)
        res.status(201).json(resHandler(result))
    } catch (err) {
        return res.status(500).json(errHandler(err))
    }
})

router.put('/', auth, async (req, res) => {
    try {
        let prevReview = await Review.findOneById(req.body.reviewId)

        req.body.reviewerId = req.session.passport.user
        let result = await Review.updateById(req.body.reviewId, req.body)

        let review = prevReview.review.split(' ')
        for (let e of review) await Word.decreaseCnt(e)
        review = req.body.review.split(' ')
        for (let e of review) await Word.upsert(e)

        res.status(200).json(resHandler(result))
    } catch (err) {
        return res.status(500).json(errHandler(err))
    }
})

router.delete('/', (req, res) => {
    Review.deleteById(req.body.id)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/all/place/:contentId/:pageNo/:numOfRows', (req, res) => {
    let numsObj = skipCntFinder(req.params.pageNo, req.params.numOfRows)
    Review.findAllByPlace(req.params.contentId, numsObj.skip, numsObj.cnt)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/all/reviewer/:reviewerId/:pageNo/:numOfRows', (req, res) => {
    let numsObj = skipCntFinder(req.params.pageNo, req.params.numOfRows)
    Review.findAllByReviewer(req.params.reviewerId, numsObj.skip, numsObj.cnt)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/star/gte/:star/:pageNo/:numOfRows', (req, res) => {
    let numsObj = skipCntFinder(req.params.pageNo, req.params.numOfRows)
    Review.findByStarGte(req.params.star, numsObj.skip, numsObj.cnt)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/star/gte/place/:star/:contentId/:pageNo/:numOfRows', (req, res) => {
    let numsObj = skipCntFinder(req.params.pageNo, req.params.numOfRows)
    Review.findByStarGteAndPlace(req.params.star, req.params.contentId, numsObj.skip, numsObj.cnt)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/star/lte/place/:star/:contentId/:pageNo/:numOfRows', (req, res) => {
    let numsObj = skipCntFinder(req.params.pageNo, req.params.numOfRows)
    Review.findByStarLteAndPlace(req.params.star, req.params.contentId, numsObj.skip, numsObj.cnt)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/cnt/:contentId', (req, res) => {
    Review.countReviews(req.params.contentId)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

router.get('/star/avg/:contentId', (req, res) => {
    Review.findStarAvg(parseInt(req.params.contentId))
        .then(result => {
            // console.log(result)
            result = Math.round((result[0].average + Number.EPSILON) * 100) / 100
            res.status(200).json(resHandler(result))
        })
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

router.get('/keyword/list/:keyword/:pageNo/:numOfRows', (req, res) => {
    let numsObj = skipCntFinder(req.params.pageNo, req.params.numOfRows)
    Review.findByKeyword(req.params.keyword, numsObj.skip, numsObj.cnt)
        .then(result => res.status(200).json(resHandler(result)))
        .catch(err => res.status(500).json(errHandler(err)))
})

module.exports = router
