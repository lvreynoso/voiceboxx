// Mongoose connection

import mongoose from 'mongoose'
import assert from 'assert'

const uri = process.env.MONGODB_URI || 'mongodb://localhost/pollution-api'
mongoose.Promise = global.Promise;
mongoose.connect(
    uri,
    { useNewUrlParser: true },
    function(err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to database");

        // db.close(); turn on for testing
    }
);

mongoose.connection.on("error", console.error.bind(console, "MongoDB connection Error:"));
mongoose.set("debug", true);

export default mongoose.connection
