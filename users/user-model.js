const db = require('../db-config.js')

module.exports = {
    getUsers,
    insertUser
}

function getUsers() {
    return db.select('*')
        .from('users')
}

function insertUser(credentials) {
    return db('users')
        .insert(credentials);
}