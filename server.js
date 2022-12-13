const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');

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

//load api docs
const swaggerDocs = YAML.load('./swagger.yaml');
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  if (listener.address().address === '::') {
    res.status(200).send({ status: "available" });

  } else {
    res.status(200).send({ status: "unavailable" });
  }
});

var listener = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
