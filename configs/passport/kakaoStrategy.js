const KakaoStrategy = require('passport-kakao').Strategy;

module.exports = passport => {
    passport.use(new KakaoStrategy({
        clientID: process.env.kakaoClientId,
        callbackURL: process.env.kakaoCallbackUrl,
    }, (accessToken, refreshToken, profile, done) => {
        try {
            // console.log('kakaoProfile', profile)
            // console.log('profileKeys', Object.keys(profile))
            // console.log()
            return done(null, {
                id: profile.id,
                provider: 'kakao',
            })
        } catch (err) {
            return done(err)
        }
    }))
}