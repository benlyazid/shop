const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/controller.error');

const connectToMongo = require('./util/database').connectToMongo

const adminRoutes = require('./routes/route.admin');
const shopRoutes = require('./routes/route.shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) =>{
    console.log(req.url)
    next()
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

connectToMongo(() =>{
    console.log("Start listening")
    app.listen(3000);
})











