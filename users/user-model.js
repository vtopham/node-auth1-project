const db = require('../db-config.js')

module.exports = {
    getUsers,
    insertUser,
    getByUsername
}

function getUsers() {
    return db.select('*')
        .from('users')
}

function insertUser(credentials) {
    return db('users')
        .insert(credentials);
}

function getByUsername(username) {
    return db.select('*')
        .from('users')
        .where({ username })
}