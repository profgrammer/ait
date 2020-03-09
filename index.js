const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bp = require('body-parser');
const cp = require('cookie-parser');

app.use(express.static('public'));
app.use(bp.json());
app.use(cp());
app.use('/auth', require('./routes/authHandler'));
app.use('/admin', require('./routes/adminHandler'));

app.get('/index', (req, res) => {
    // console.log(path.join(__dirname, 'public','index.html'));
    res.status(200).sendFile(path.join(__dirname, 'public','index.html'));
})

app.get('/news', (req, res) => {
    // console.log(path.join(__dirname, 'public','index.html'));
    res.status(200).sendFile(path.join(__dirname, 'public','news.html'));
})


app.get('/about', (req, res) => {
    // console.log(path.join(__dirname, 'public','index.html'));
    res.status(200).sendFile(path.join(__dirname, 'public','about.html'));
})

app.get('/shop', (req, res) => {
    // console.log(path.join(__dirname, 'public','index.html'));
    res.status(200).sendFile(path.join(__dirname, 'public','shop.html'));
})

app.get('/contact', (req, res) => {
    // console.log(path.join(__dirname, 'public','index.html'));
    res.status(200).sendFile(path.join(__dirname, 'public','contact.html'));
})

app.get('/wishlist', (req, res) => {
    // console.log(path.join(__dirname, 'public','index.html'));
    res.status(200).sendFile(path.join(__dirname, 'public','wishlist.html'));
})

app.get('/cart', (req, res) => {
    // console.log(path.join(__dirname, 'public','index.html'));
    res.status(200).sendFile(path.join(__dirname, 'public','cart.html'));
})

app.get('/product-single', (req, res) => {
    // console.log(path.join(__dirname, 'public','index.html'));
    res.status(200).sendFile(path.join(__dirname, 'public','product-single.html'));
})

app.get('/loginsignup', (req, res) => {
    // console.log(path.join(__dirname, 'public','index.html'));
    res.status(200).sendFile(path.join(__dirname, 'public','loginsignup.html'));
})

app.get('*', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public','error.html'));
})


app.listen(3000, () => console.log("listening on port 3000"));