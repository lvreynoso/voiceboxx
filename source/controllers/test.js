// index.js

import express from 'express'
const test = express.Router()

test.get('/', (req, res) => {
    res.render('test')
})

export default test;
