const Product = require('../models/model.product');
const Cart = require('../models/model.cart');
const User = require('../models/model.user');
const OrderItem = require('../models/model.orderItem');
const { ObjectId } = require('mongodb');

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(data => {
			res.render('shop/product-list', {
				prods: data,
				pageTitle: 'All Products',
				path: '/products'
			})
		})
		.catch(err => {
			if (err)
				console.log(err)
		})
};

exports.getProduct = (req, res, next) => {
	const productId = req.params.productId;
	Product.findById(ObjectId(productId))
		.then(product => {
			if (!product)
				res.redirect('/products')
			else {
				console.log(product)
				res.render('shop/product-detail', {
					product: product,
					pageTitle: product.title,
					path: '/products'
				});
			}
		})
		.catch(err => {
			console.log("ERROR IN FINDING PRODUCT BY INDEX : " + err)
		})
};

exports.getIndex = (req, res, next) => {
	Product.find()
		.then(data => {
			res.render('shop/index', {
				prods: data,
				pageTitle: 'Shop',
				path: '/'
			})
		})
		.catch(err => {
			if (err)
				console.log(err)
		})
};

exports.getCart = (req, res, next) => {
	const promises = []
	User.getUser(req.user._id)
		.then(async user => {
			const items = user.cart.items
			const products = []
			for (let index = 0; index < items.length; index++) {
				const item = items[index];
				promises.push(
					Product.findById(item.productId)
						.then(product => {
							product.quantity = item.quantity
							products.push(product)
						})
						.catch(err => console.log(err))
				)
			}
			await Promise.all(promises)
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: products
			})
		})
		.catch(err => console.log("error is : ", err))
};

exports.postCart = (req, res, next) => {
	// todo get cart items ...inseert item update cart
	
	const productId = req.body.productId;
	User.addProductToCart(productId, req.user)
		.then(ret => {
			console.log(ret)
			res.redirect('/products')
		})
		.catch(err => {
			console.log(err);
		})
};

exports.deleteItem = (req, res, next) => {
	const productId = req.body.productId
	let updatedCart
	let productIndex
	let products
	User.getUser(req.user._id)
		.then(user => {
			updatedCart = user.cart
			products = updatedCart.items
			productIndex = products.findIndex(prd => prd.productId == productId)
			if (productIndex != -1) {
				let newQuantity = products[productIndex].quantity - 1
				if (newQuantity == 0) {
					updatedCart.items.splice(productIndex, 1)
				}
				else {
					updatedCart.items[productIndex].quantity = newQuantity
				}
				return User.updateCart(req.user._id, updatedCart)
			}
			return Promise.resolve()
		})
		.then(data => {
			res.redirect('/cart')
		})
		.catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
	req.user.getOrders({ include: ['products'] })
		.then(orders => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders
			});
		})
		.catch(err => console.log(err))
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	});
};

exports.createOrder = (req, res, next) => {
	let _products, _fetchedCart;
	// let _cart = req.user.cart
	// // req.user.getCart()
	// 	// .then(cart => {
	// _fetchedCart = cart
	// return cart.getProducts();
	// 	// })
	// 	.then(products => {
	// 		_products = products
	// 		return req.user.createOrder()
	// 	})
	// 	.then(order => {
	// 		order.addProducts(
	// 			_products.map(product => {
	// 				product.orderItem = { quantity: product.cartItem.quantity }
	// 				return product
	// 			})
	// 		)
	// 	})
	// 	.then(result => {
	// 		console.log("data hase been removed from cart")
	// 		return _fetchedCart.setProducts(null)
	// 	})
	// 	.then(result => {
	// 		console.log("data have been inserted in order Table")
	// 		res.redirect('/orders')
	// 	})
	// 	.catch(err => console.log("error in inserting order \n\n" + err))
}