const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/login', (req, res) => {
    const email = req.body.email, password = req.body.password;
    console.log(email, password);
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json')));
    let user = null;
    users.forEach(u => {
        if(u.email === email) {
            user = u;
        }
    })
    if(user === null) {
        res.json({success: false, message: 'no user found'});
    } else {
        if(password === user.password)
            res.cookie('email', user.email).json({success: true, email: user.email});
        else 
        res.json({success: false, message: 'wrong password'});
    }
});

router.post('/signup', (req, res) => {
    const email = req.body.email, password = req.body.password;
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json')));
    let user = null;
    users.forEach(u => {
        if(u.email === email) {
            user = u;
        }
    })
    if(user === null) {
        users.push({email, password});
        fs.writeFileSync(path.join(__dirname, '..', 'users.json'), JSON.stringify(users));
        res.json({success: true, email: email});
    } else {
        res.json({success: false, message: 'user already exists'});
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie("email").redirect('/index');
});

module.exports = router;