const express = require('express');
const cors = require('cors');
const bp = require('body-parser');
const routes = require('./routes');

const app = express();


app.use(bp.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3434);

