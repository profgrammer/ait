const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

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

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
});

router.post('/addproduct', upload.fields([{name: 'photo', maxCount: 1}, {name: 'photos', maxCount: 10}]), (req, res) => {
    const {name, description, price} = req.body;
    const file = req.files;
    console.log(file);
    res.json({name, description, price, file});
})

module.exports = router;