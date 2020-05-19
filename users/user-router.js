// /api

const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const router = express.Router();
router.use(express.json())

//configure the cookies for login

const sessionConfig = {
    name: 'cookiemonster',
    secret: 'cookies',
    cookie: {
        maxAge: 1000 * 60 * 5, //5 minute max age
        secure: false,
        httpOnly: false
    },
    resave: false,
    saveUninitialized: true
}

router.use(session(sessionConfig));
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
                    //login is successful
                    req.session.userid = credentials[0].id
                    res.status(200).json({data: "Logged in"})
                } else {
                    //credentials were not correct
                    res.status(403).json({message: "invalid credential. You shall not pass!"})
                }
                // res.status(200).json({message: credentials})
            }
            
        })
        .catch(err => {
            res.status(500).json({message: "Error retrieving credential information", error: err});
        })
    
})

//If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.
router.get('/users', isLoggedIn, (req, res) => {
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

function isLoggedIn(req, res, next) {
    if(req.session && req.session.userid) {
        next();
    } else {
        res.status(400).json({message: "Please log in to see this content"})
    }
}



module.exports = router;