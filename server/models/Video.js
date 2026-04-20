const Datastore = require('nedb');
const db = new Datastore({
    filename: './data/videos.db',
    autoload: true
});
module.exports = db;