const express = require('express');
const router = express.Router();
const homerequest = require('../funcs/homerequest.js');

router.get('', (req, res) => {
    homerequest().then((response) => { 
        res.render('home', response);
        res.end();
    }).catch((error) => { console.log(error); })
});

module.exports = router;