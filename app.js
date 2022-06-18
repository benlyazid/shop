const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/controller.error');
const db = require('./util/database')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
console.log("start")
    
// db.createIfNotExist()
console.log("end")

const adminRoutes = require('./routes/route.admin');
const shopRoutes = require('./routes/route.shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log("************************************")
    console.log(req.method)
    console.log(req.url)
    console.log("************************************")
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);


