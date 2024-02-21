const express = require('express');
const app = express();
const path = require('path');
const HomeRouter = require('./routes/home');
const OpenAIRouter = require('./routes/openai');
const connect = require('./funcs/dbconnect.js');
const mongoose = require('mongoose');
const API = require('./funcs/data.js');

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//json url decode
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//css and js's path
app.use(express.static(__dirname));
//app.use(express.static(__dirname+'/jss'));
//app.use(express.static(__dirname+'/csss'));

//routes
app.use('/Home', HomeRouter);
app.use('/OpenAI', OpenAIRouter);

//main page get
app.get('/', (req, res)=> { 
    res.render('main'); 
    res.end();
});

//connect to db
mongoose.connection.once('open', () => { 
    console.log("db connect success!!");
    app.listen(API.Port, API.IpAddress, function(error) { 
        if(error) { console.log("Server start error\n"); }
    });
});


