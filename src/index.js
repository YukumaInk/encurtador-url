const express = require('express');
const cors = require('cors');
const bp = require('body-parser');
const routes = require('./routes');
let ejs = require('ejs'),
    people = ['geddy', 'neil', 'alex'],
    html = ejs.render('<%= people.join(", "); %>', {people: people});


const app = express();


app.use(bp.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3434);

