var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('omsapi-config');

module.exports = function (passport) {
    passport.use('access-token',
        new JwtStrategy({
            secretOrKey: config.get('token:accessSecret'),
            jwtFromRequest: ExtractJwt.fromAuthHeader()
        }, function (payload, done) {
            done(null, payload);
        }));
};