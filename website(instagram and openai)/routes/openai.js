const express = require('express');
const FormData = require('form-data');
const mongoose = require('mongoose');
const router = express.Router();
const openairequest = require('../funcs/openairequest.js');

const dataSchema = mongoose.Schema({
    role: String,
    content: String,
});
const dataModel = mongoose.model("messages", dataSchema);


router.get('/', (req, res) => {
    res.render('openai');
    res.end();
});


router.post('/post', (req, res, next) => {
    const sentence = req.query.sentence || req.body.sentence;
    const body = {
        "model": "gpt-3.5-turbo",
        "messages": [{ "role": "user", "content": sentence }],
        "max_tokens": 300,
    };
    let messages = [];
    messages.push({ role: "user", content: sentence });
    //async
    openairequest(body).then((response) => {
        messages.push(response.Data.choices[0].message);
        dataModel.insertMany(messages).then(() => { console.log("Insert Success"); }).catch((error) => { console.log("Insert Failed"); });
        res.send(response);
        res.end();
    }).catch((error) => {
        res.send(error);
        res.end();
    });
});

module.exports = router;