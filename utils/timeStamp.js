module.exports = (req, res, next) => {
    console.log('[Current Session ID]: ', req.session.id)
    let currTime = new Date();
    let timeStamp = currTime.getHours() + ':' + currTime.getMinutes();
    console.log('[HTTP CALL]: ', timeStamp)
    // console.log('req.cookies', req.cookies)
    console.log('[TimeStamp]: Cookie:', req.headers.cookie)
    console.log()
    next()
}