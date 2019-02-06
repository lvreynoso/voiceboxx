// auth.js

import express from 'express'
import jwt from 'jsonwebtoken'

const auth = express.Router()

// models
import User from '../models/user.js'

auth.get('/sign-up', (req, res) => {
    res.render('sign-up');
})

auth.post('/sign-up', async (req, res) => {
    const user = new User(req.body);
    const result = await user.save().catch(err => {
        console.log(err);
        return res.status(400).send({ err: err })
    });
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: `60 days` });
    res.cookie(`nToken`, token, { maxAge: 900000, httpOnly: true });
    res.redirect(`/`);
})

auth.get('/logout', (req, res) => {
    res.clearCookie(`nToken`);
    res.redirect(`/`);
})

auth.get('/login', (req, res) => {
    res.render(`login`);
})

auth.post(`/login`, async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const query = {
        username: username
    }
    const user = await User.findOne(query, `username password`).catch(err => { console.log(err) })
    if (!user) {
        // user not found
        return res.status(401).send({ message: `Wrong username or password` });
    }
    // check the password
    user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
            return res.status(401).send({ message: `Wrong username or password` });
        }
        // create a token
        const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
            expiresIn: `60 days`
        });
        res.cookie(`nToken`, token, { maxAge: 900000, httpOnly: true });
        res.redirect(`/`);
    })
})

export default auth;
