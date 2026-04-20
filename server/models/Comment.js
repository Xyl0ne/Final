const Datastore = require('nedb');
const db = new Datastore({
    filename: './data/comments.db',
    autoload: true
});
module.exports = db;