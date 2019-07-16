const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')

function tokenForUser(user) {
    const timestamp = new Date().getTime()
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = function(req, res, next) {
    res.send({ token: tokenForUser(req.user) })
}

exports.signup = function(req, res, next) {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        return res.status(422).send({
            error: 'Both email and password are required'
        })
    }

    User.findOne({ email: email }, function(err, existingUser) {
        if (err) return next(err)

        if (existingUser) {
            return res.status(422).send({
                error: 'Email is already registered'
            })
        }

        const user = new User({
            email,
            password
        })
        
        user.save(function(err) {
            if (err) return next(err)

            res.json({
                success: true,
                message: "Account created",
                token: tokenForUser(user)
            })
        })
    })
}