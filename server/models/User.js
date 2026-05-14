const Datastore = require('@seald-io/nedb');
const db = new Datastore({
    filename: './data/users.db',
    autoload: true
});
module.exports = db;