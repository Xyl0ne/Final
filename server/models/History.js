const Datastore = require('nedb');
const db = new Datastore({
    filename: './data/history.db',
    autoload: true
});
module.exports = db;