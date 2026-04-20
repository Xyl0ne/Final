const Datastore = require('nedb');
const db = new Datastore({
    filename: './data/subscriptions.db',
    autoload: true
});
module.exports = db;