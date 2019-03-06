// index.js

import express from 'express'
const test = express.Router()

// model
import Song from '../models/song.js'

// deps
import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

test.get('/', (req, res) => {
    res.render('test')
})

test.get('/upload', (req, res) => {
    res.render('upload')
})

test.post('/upload', upload.array('data', 1), async (req, res) => {
    console.log("upload incoming!")
    let newlineRegex = /\\n/gi
    let cleanTab = req.body.tab.replace(newlineRegex, '\n')
    var input = {
        slug: req.body.slug,
        artist: req.body.artist,
        title: req.body.title,
        lyrics: req.body.lyrics,
        notes: req.body.notes,
        tab: cleanTab,
        data: Buffer.from(req.files[0].buffer)
    }

    let song = new Song(input)

    song.save().catch(err => { console.log(err) });

    console.log(song.tab)

    res.status(200)
})

export default test;
