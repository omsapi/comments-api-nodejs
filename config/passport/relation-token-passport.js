var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('omsapi-config');

module.exports = function (passport) {
    passport.use('relation-token',
        new JwtStrategy({
            secretOrKey: config.get('token:relationSecret'),
            jwtFromRequest: ExtractJwt.fromHeader('relation-token')
        }, function (payload, done) {
            done(null, payload);
        }));
};