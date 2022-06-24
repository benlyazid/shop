const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/controller.error');

const Product = require('./models/model.product')
const User = require('./models/model.user')
const Cart = require('./models/model.cart')
const CartItem = require('./models/model.cartItem')
const Order = require('./models/model.order')
const OrderItem = require('./models/model.orderItem')

const adminRoutes = require('./routes/route.admin');
const shopRoutes = require('./routes/route.shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) =>{ //? add user to req middelware
//     User.findByPk(1)
//     .then(user =>{
//         req.user = user
//         next()
//     })
//     .catch(err =>{
//         console.log('error in finding user 1 ')
//         console.log(err);
//     })
// })

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);









