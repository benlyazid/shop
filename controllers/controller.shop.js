const Product = require('../models/model.product');
const Cart = require('../models/model.cart');
const User = require('../models/model.user');
const OrderItem = require('../models/model.orderItem');

exports.getProducts = (req, res, next) => {
	Product.findAll()
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
	Product.findById(productId)
	.then(product => {
		if (!product)
			res.redirect('/products')
		else {
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
	Product.findAll()
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
	req.user.getCart()
		.then(cart => {
			return cart.getProducts()
				.then(products => {
					res.render('shop/cart', {
						path: '/cart',
						pageTitle: 'Your Cart',
						products: products
					})
				})
		})
		.catch(
			err => console.log("error is : ", err))
};

exports.postCart = (req, res, next) => { // add product as parameter to show it in the cart 
	const productId = req.body.productId;
	let fetchedCart;
	let newQuantity = 1
	req.user.getCart()
		.then(cart => {
			fetchedCart = cart;
			return cart.getProducts({
				where: {
					id: productId
				}
			})
		})
		.then(products => {
			let product;
			if (products.length > 0) {
				product = products[0]
			}
			if (product) { //? product already exesiste in cart
				//> Update Product quantity
				const oldQuantity = product.cartItem.quantity
				newQuantity = oldQuantity + 1;
				return product
			}
			return Product.findByPk(productId)
		})
		.then(product => {
			console.log("PRODUCT IS " + product + " quatity " + newQuantity)
			return fetchedCart.addProduct(product, {
				through:
				{
					quantity: newQuantity
				}
			})
		})
		.then(ans => res.redirect('/products'))
		.catch(
			err => console.log("error is : ", err))
};

exports.deleteItem = (req, res, next) => {
	const productId = req.body.productId
	let fetchedCart
	let product
	req.user.getCart()
		.then(cart => {
			fetchedCart = cart
			return cart.getProducts({ where: { id: productId } })
		})
		.then(products => {
			product = products[0]
			let newQuantity = product.cartItem.quantity - 1
			if (newQuantity > 0) {
				return fetchedCart.addProduct(product, {
					through:
					{
						quantity: newQuantity
					}
				})
			}
			else {
				return product.cartItem.destroy()
			}
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
		.catch()
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	});
};

exports.createOrder = (req, res, next) => {
	let _products, _fetchedCart;
	req.user.getCart()
		.then(cart => {
			_fetchedCart = cart
			return cart.getProducts();
		})
		.then(products => {
			_products = products
			return req.user.createOrder()
		})
		.then(order => {
			order.addProducts(
				_products.map(product => {
					product.orderItem = { quantity: product.cartItem.quantity }
					return product
				})
			)
		})
		.then(result => {
			console.log("data hase been removed from cart")
			return _fetchedCart.setProducts(null)
		})
		.then(result => {

			console.log("data have been inserted in order Table")
			res.redirect('/orders')
		})
		.catch(err => console.log("error in inserting order \n\n" + err))
}