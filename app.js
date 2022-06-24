const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/controller.error');
const sequelize = require('./util/database').sequelize

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

app.use((req, res, next) =>{ //? add user to req middelware
    User.findByPk(1)
    .then(user =>{
        req.user = user
        next()
    })
    .catch(err =>{
        console.log('error in finding user 1 ')
        console.log(err);
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
User.hasMany(Product, {
    constraints: true,
    onDelete: 'CASCADE'
})
User.hasOne(Cart)
// Cart.belongsTo(User)
Cart.belongsToMany(Product, {through : CartItem})
Product.belongsToMany(Cart, {through : CartItem})
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, {through: OrderItem})


let _user;
sequelize.sync()
// sequelize.sync({ force: true })
    .then(res => {
        return User.findByPk(1);
    })
    .then(user =>{
        if (!user){
            return User.create({name : 'root', mail : 'root.@admin.shop.ma'})
        }

        else{
            return Promise.resolve(user)
        }
    })
    .then(user =>{
        _user = user
        console.log("User has been inserted")
        return user.getCart()
    })
    .then(cart =>{
        if (!cart)
            return _user.createCart()
        return Promise.resolve(cart) //> serch for Promiss.resolve() for more info
    })
    .then(() =>{
        console.log("Cart has been created")
        app.listen(3000);
    })
    .catch(err => {
        console.log("error is ")
        console.log(err);
    })








