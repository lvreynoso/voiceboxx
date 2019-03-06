// song.js

import mongoose from 'mongoose'
const Schema = mongoose.Schema

const SongSchema = new Schema({
    slug: { type: String, required: true},
    artist: { type: String, required: true },
    title: { type: String, required: true },
    lyrics: { type: String },
    notes: { type: String },
    data: Buffer
})

const Song = mongoose.model('Song', SongSchema)
export default Song