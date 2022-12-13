var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var mysql = require("mysql");
const { env } = require("./env");
const bcrypt = require("bcrypt");

/*env = {
    DB_password: 'password',
    DB_USER: 'root',
    DB_NAME: 'db-name',
    DB_HOST: 'localhost',
    DB_PORT: '3306'
    DB_TABLE: 'table-name'
};*/

//createConnection
const connectDB = mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  database: env.DB_NAME,
  port: env.DB_PORT,
  password: env.DB_password,
});
//connectDB
connectDB.connect(function (err) {
  if (err) {
    console.log(err);
    console.log("database not connected!");
  } else {
    console.log("database Connected successfully!");
  }
});

//register User
router.post("/user", jsonParser, (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  const sql = `SELECT * FROM ${env.DB_TABLE} WHERE email = '${email}'`;
  connectDB.query(sql, function (err, result) {
    if (err) throw err;
    if (result.length > 0) {
      res.status(400).send({ result: "User already exist" });
    } else {
      console.log("User not exist");
      //encrypt password
      let saltRounds = bcrypt.genSaltSync(10);
      let encryptPassword = bcrypt.hashSync(password, saltRounds);
      //create user
      let sqlQuery = `INSERT INTO ${env.DB_TABLE} (password, email) VALUES ('${encryptPassword}', '${email}')`;
      connectDB.query(sqlQuery, function (err, result) {
        if (err) throw err;
        if (result) {
          res.status(200).send({ result: "User created successfully" });
        }
      });
    }
  });
});

//login route
router.post("/user/login", jsonParser, (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
    if (email && password) {
        let sqlQuery = `SELECT * FROM ${env.DB_TABLE} WHERE email = '${email}'`;
        connectDB.query(sqlQuery, function (error, results, fields) {
            if (error) throw error;
            if (results.length == 0) {
                res.status(404).send({ result: "User not exist!" });
            }
            if (results.length > 0) {
                const dbPassword = results[0].password;
                //compare password
                let isPasswordCorrect = bcrypt.compareSync(
                    password,
                    dbPassword,
                    function (err, result) {
                        if (err) throw err;
                        return result;
                    }
                );

                if (isPasswordCorrect) {
                    req.session.email = email;
                    res.status(200).send({ result: "Login successfully" });
                } else {
                    res.status(401).send({ result: "Incorrect email and/or Password!" });
                }
            }
        });
    }else {
    res.status(400).send({ result: "Please enter email and Password!" });
  }
});

//logout route
router.get('/user/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send({ result: "Logout successfully" });
        }
    });
});

router.get('/oauth/authorize', (req, res) => {
  console.log(req);
  res.status(200).send({ result: "Welcome to authorize" });
});

//dashboard route
router.get("/dashboard", (req, res) => {
    if (req.session.email) {
      res.status(200).send({ result: "Welcome to dashboard" });
  } else {
    res.status(404).send({ result: "Please login first" });
  }
});

module.exports = router;
