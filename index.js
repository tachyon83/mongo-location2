require('dotenv').config()
const http = require('http');
const express = require('express');
// const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./configs/passport/passportConfig')
passportConfig(passport)
const morgan = require('morgan')
const timeStamp = require('./utils/timeStamp')
const cors = require('cors');
const webSettings = require('./configs/webSettings')
const auth = require('./utils/auth')

// need to see the connection message!
const mongooseConnect = require('./models/mongooseConnect')
mongooseConnect()

const app = express();
app.use(morgan('short'))
app.use(express.json())
app.set('port', process.env.PORT || 3005);
app.use(webSettings.sessionRedisMiddleware)
// important: this [cors] must come before Router
app.use(passport.initialize());
app.use(passport.session());
// cors called after session and passport
app.use(cors(webSettings.corsSettings));


app.use(timeStamp)
app.use('/location', auth, require('./routers/location'))
app.use('/user', require('./routers/user'))
// app.use('/location', require('./routers/location'))

// 404
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    console.log('reached the end...404 or 500')
    console.log('check cors, path, method...etc')
    console.log(err)
    console.log()
    res.status(err.status || 500).json({ packet: '404 or 500...' })
});

const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log('http://localhost:%d', app.get('port'));
    console.log()
});