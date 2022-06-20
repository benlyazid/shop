const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/controller.error');
// const db = require('./util/database')
const sequelize = require('./util/database').sequelize

const adminRoutes = require('./routes/route.admin');
const shopRoutes = require('./routes/route.shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// db.createIfNotExist()
sequelize.sync()
    .then(res => {
        // console.log(res)
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    })

	


