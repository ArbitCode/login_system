const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

const router = require('./router');

const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

//load static files
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'public//assets')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use('/', router);

app.get('/', (req, res) => {
    res.render('home.ejs', {title: 'Login System'});
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
