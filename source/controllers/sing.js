// index.js

import express from 'express'
const sing = express.Router()

sing.get('/', (req, res) => {
    res.render('sing')
})

export default sing;
