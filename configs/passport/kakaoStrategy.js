const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../../models/schemas/user')

module.exports = passport => {
    passport.use(new KakaoStrategy({
        clientID: process.env.kakaoClientId,
        callbackURL: process.env.kakaoCallbackUrl,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // console.log('kakaoProfile', profile)
            // console.log('profileKeys', Object.keys(profile))
            // console.log()

            profile.id = process.env.kakaoUser + profile.id
            let user = await User.findOneById(profile.id)

            if (!user) {
                user = {
                    id: profile.id,
                    pw: '-',
                    name: profile.username,
                    provider: 'kakao',
                }
                console.log('[kakaoStrategy]: Now saving a new user from Kakao...')
                console.log()
                user = await User.signUp(user)
            } else {
                console.log('[kakaoStrategy]: Existing user from Kakao...')
                console.log()
            }
            return done(null, user)
        } catch (err) {
            return done(err)
        }
    }))
}