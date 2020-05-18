// /api

const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router();
router.use(express.json())

const Users = require('./user-model')

//Creates a user using the information sent inside the body of the request. Hashes the password before saving the user to the database.
router.post('/register', validateCredentials, (req, res) => {
    
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 12);
    credentials.password = hash;

    Users.insertUser(credentials)
        .then(id => {
            res.status(200).json({data: id})
        })
        .catch(err => {
            res.status(500).json({message: "Error adding user to database", error: err});
        })

})

//Use the credentials sent inside the body to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!'
router.post('/login', validateCredentials, (req, res) => {
    Users.getByUsername(req.body.username)
        .then(credentials => {
            //if the username isn't found let them know
            if (credentials.length === 0) {
                res.status(404).json({message: "Username not found"})
            } else {
            //otherwise, validate the information
                if(bcrypt.compareSync(req.body.password, credentials[0].password)) {
                    res.status(200).json({data: credentials})
                } else {
                    res.status(403).json({message: "invalid credentials"})
                }
                // res.status(200).json({message: credentials})
            }
            
        })
        .catch(err => {
            res.status(500).json({message: "Error retrieving credential information", error: err});
        })
    
})

//If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.
router.get('/users', (req, res) => {
    Users.getUsers()
        .then(users => {
            res.status(200).json({data: users});
        })
        .catch(err => {
            res.status(500).json({message: "Error retrieving users from database", error: err});
        });
})


function validateCredentials(req, res, next) {
    if(req.body && req.body.username && req.body.password) {
        next();
    } else {
        res.status(400).json({message: "Please include a username and password in the body of your request"})
    }
}



module.exports = router;