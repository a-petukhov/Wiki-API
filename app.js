//jshint esversion:8

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB?retryWrites=true&w=majority');

const articleSchema = new mongoose.Schema({
    title: String,
    conmtent: String
});
const Article = new mongoose.model('Article', articleSchema);

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.get('/', (req, res) => {
    Article.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
});

app.listen(port, (req, res) => {
    console.log('The server is now running on port ' + port + '.');
});