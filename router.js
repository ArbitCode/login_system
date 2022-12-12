var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var mysql = require('mysql');
const { env } = require('./env');

/*env = {
    DB_PASSWORD: 'password',
    DB_USER: 'root',
    DB_NAME: 'db-name',
    DB_HOST: 'localhost',
    DB_PORT: '3306'
};*/
const connectDB = mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    database: env.DB_NAME,
    port: env.DB_PORT,
    password: env.DB_PASSWORD,
});


connectDB.connect(function (err) {
    if (err) {
        console.log(err);
        console.log("database not connected!");
    }
    else {
    console.log("database Connected successfully!");
    };
});

//home route
router.post('/login', jsonParser, (req, res) => {
    let Email = req.body.email;
    let Password = req.body.password;

    let sqlQuery = `SELECT * FROM accounts WHERE email = '${Email}' AND password = '${Password}'`;
    
    if (Email && Password) {

        connectDB.query(sqlQuery, function (error, results, fields) {
            if (error) console.log(error.stack);
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.email = Email;
                res.redirect('/dashboard');
            } else {
                res.send('Incorrect Email and/or Password!');
            }
            res.end();
        }
        )
    } else {
        res.send('Please enter Email and Password!');
    }
});

router.get('/dashboard', (req, res) => {
    if (req.session.email) {
        res.render('dashboard', { user:req.session.email});
    }
    else {
        res.send('Please login to view this page!');
    }
});

module.exports = router;
