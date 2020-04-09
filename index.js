const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bp = require('body-parser');
const cp = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const config = require('./configuration/config');

mongoose.connect('mongodb://localhost:27017/ecommerce', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('connected to database'))
.catch(err => console.log(err));

app.use(express.static('public'));
app.use('/images', express.static('uploads'));

app.use(bp.json());
app.use(cp());
app.use('/auth', require('./routes/authHandler'));
app.use('/admin', require('./routes/adminHandler'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      if(config.use_database) {
        // if sets to true
        pool.query("SELECT * from user_info where user_id="+profile.id, (err,rows) => {
          if(err) throw err;
          if(rows && rows.length === 0) {
              console.log("There is no such user, adding now");
              pool.query("INSERT into user_info(user_id,user_name) VALUES('"+profile.id+"','"+profile.username+"')");
          } else {
              console.log("User already exists in database");
          }
        });
      }
      return done(null, profile);
    });
  }
));


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

app.get('/facebook', function(req, res){
    res.render('indexfb', { user: req.user });
  });
  
//   app.get('/account', ensureAuthenticated, function(req, res){
//     res.render('account', { user: req.user });
//   });
  
  app.get('/facebookauth', passport.authenticate('facebook',{scope:'email'}));
  
  
  app.get('/facebookauth/callback',
    passport.authenticate('facebook', { successRedirect : '/facebook', failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/facebook');
    });
  
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/index');
  });
  
  
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
  }
  

app.get('*', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public','error.html'));
})



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/facebook')
  }

app.listen(3000, () => console.log("listening on port 3000"));


