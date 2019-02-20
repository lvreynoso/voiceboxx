// index.js

import express from 'express'
const index = express.Router()

index.get('/', (req, res) => {
    const currentUser = req.user;
    res.render('index', { currentUser })
})

export default index;
