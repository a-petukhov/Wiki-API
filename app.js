//jshint esversion:8

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB?retryWrites=true&w=majority');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Article = new mongoose.model('Article', articleSchema);

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.route('/articles')
    .get((req, res) => {
        Article.find({}, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send('Successfully saved a new article.');
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send('Successfully deleted all articles.');
            }
        });
    });

app.route('/articles/:articleTitle')
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result);
                }
        });
    })
    .put((req, res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send('Article updated successfully.');
            }
        });
    })
    .patch((req, res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send('Article updated successfully.');
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany({title: req.params.articleTitle}, (err) => {
            if (err) {
                res.send(err);
            } else {
                res.send('Successfully deleted an article.');
            }
        });
    });

app.listen(port, (req, res) => {
    console.log('The server is now running on port ' + port + '.');
});