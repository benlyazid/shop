const path = require('path');

const express = require('express');

const shopController = require('../controllers/controller.shop');
const isAuth = require('../middleware/middlware.isAuth')

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.deleteItem);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/checkout', isAuth, shopController.getCheckout);

router.post('/create-order', isAuth, shopController.createOrder);


module.exports = router;
