const path = require('path');
const mongoose = require('mongoose')

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/controller.error');

const connectToMongo = require('./util/database').connectToMongo
const connectToMongoose = require('./util/database').connectToMongoose

const adminRoutes = require('./routes/route.admin');
const shopRoutes = require('./routes/route.shop');

const app = express();

const User = require('./models/model.user')
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {

    console.log('***********************************')
    console.log('REQUSET URL IS ' + req.url)
    console.log('***********************************')
    next()
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);



connectToMongoose()
    .then((res)=> {
        console.log("CONNECT SUCCEFULLY....\n" +  JSON.stringify(res))
        app.listen(3000);
    })
    .catch(err => {
        console.log("ERROR ON CONNECT....\n" + err)
    })
