// index.js

import express from 'express'
const sing = express.Router()

// models
import Song from '../models/song.js'

sing.get('/', (req, res) => {
    res.render('sing')
})

sing.get('/:artist/:song', async (req, res) => {
    let query = {
        slug: `${req.params.artist}-${req.params.song}`
    }

    const song = await Song.findOne(query).catch(err => {
        console.log(err)
    })

    console.log(song)

    res.render('sing', { song: song })
})

export default sing;
