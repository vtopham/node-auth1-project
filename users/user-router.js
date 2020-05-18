// /api

const express = require('express')

const router = express.Router();

router.get('/register', (req, res) => {
    res.status(200).json({message: "You got to register"})
})

router.post('/login', (req, res) => {
    
})

router.get('/users', (req, res) => {
    
})

module.exports = router;