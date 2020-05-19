const express = require('express')
const UserRouter = require('./users/user-router');
const server = express();

server.use("/api", UserRouter)

server.get('/', (req, res) => {
    res.status(200).json({message: "Go get em tiger"})
})





module.exports = server;