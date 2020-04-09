const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({storage: storage});

router.use(express.static('public'));

router.get('/dashboard', async (req, res) => {
    const products = await Product.find();
    res.render('dashboard', {products});
});

router.get('/addproduct', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'addproduct.html'));
});

router.get('/update/:id', async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.render('update', {product});
});

router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.redirect('/admin/dashboard');
});

router.get('/getallusers', (req,res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'allusers.html'))
});

router.get('/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json')));
    console.log(users);
    // const email_id = Object.keys(users);
    // console.log(email_id);
    res.status(200).send(users);

})

router.post('/update/:id', upload.single('photo'), async (req, res) => {
    const id = req.params.id;
    const file = req.file;
    const {name, description, price} = req.body;
    if(file) {
        const body = {name, description, price, photoUrl: `/images/${file.filename}`};
        await Product.findByIdAndUpdate(id, body);
        res.redirect('/admin/dashboard');
    } else {
        const body = {name, description, price};
        await Product.findByIdAndUpdate(id, body);
        res.redirect('/admin/dashboard');
    }
});

router.post('/addproduct', upload.fields([{name: 'photo', maxCount: 1}, {name: 'photos', maxCount: 10}]), async (req, res) => {
    const {name, description, price} = req.body;
    const file = req.files.photo[0];
    const photoUrl = `/images/${file.filename}`;
    const product = new Product({_id: mongoose.Types.ObjectId(), name, description, price, photoUrl});
    await product.save();
    res.redirect('/admin/dashboard');
})

router.post('/products/add', upload.fields([{name: 'photo', maxCount: 1}, {name: 'photos', maxCount: 10}]), async (req, res) => {
    const {name, description, price} = req.body;
    const file = req.files.photo[0];
    const photoUrl = `/images/${file.filename}`;
    const product = new Product({_id: mongoose.Types.ObjectId(), name, description, price, photoUrl});
    await product.save();
    res.json(product);
})

router.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
})

router.put('/products/update/:id', upload.single('photo'), async (req, res) => {
    const id = req.params.id;
    const file = req.file;
    const {name, description, price} = req.body;
    console.log(name, description, price);
    if(file) {
        const body = {name, description, price, photoUrl: `/images/${file.filename}`};
        const product = await Product.findByIdAndUpdate(id, body);
        res.json(product);
    } else {
        const body = {name, description, price};
        const product = await Product.findByIdAndUpdate(id, body);
        res.json(product);
    }
});

router.delete('/products/delete/:id', async (req, res) => {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.json({message: 'deleted successfully'});
})

module.exports = router;