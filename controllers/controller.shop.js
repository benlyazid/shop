const Product = require('../models/model.product');
const User = require('../models/model.user');
const Order = require('../models/model.order');
const { ObjectId } = require('mongodb');

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(data => {
			console.log("data : " + data)
			res.render('shop/product-list', {
				prods: data,
				pageTitle: 'All Products',
				path: '/products',
				isLoggedIn : req.session.isLoggedIn
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
	.populate('userId')
		.then(product => {
			if (!product)
				res.redirect('/products')
			else {
				res.render('shop/product-detail', {
					product: product,
					pageTitle: product.title,
					path: '/products',
					isLoggedIn : req.session.isLoggedIn
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
			console.log(req.session.isLoggedIn)
			res.render('shop/index', {
				isLoggedIn : req.session.isLoggedIn,
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
	const productsFetchedFromCart = []
	User.findById(req.session.user._id)
	.populate('cart.items.productId')
	.lean()
	.then(data => {
		console.log(data)
		if (data){
			data.cart.items.forEach(element => {
				console.log(element)
				let product = element.productId
				product.quantity = element.quantity
				productsFetchedFromCart.push(product)
			});
		}
		res.render('shop/cart', {
			path: '/cart',
			pageTitle: 'Your Cart',
			products: productsFetchedFromCart,
			isLoggedIn : req.session.isLoggedIn,
		})
	})
	.catch(err => console.log(err))
};

exports.postCart = (req, res, next) => {
	const productId = req.body.productId;
	const user = req.session.user	
	const _item = {
		productId : productId,
		quantity : 1
	}
	const _itemIndex = user.cart.items.findIndex((item => item.productId == productId))
	console.log("index of product in cart is " + _itemIndex)
	if (_itemIndex == -1)
		user.cart.items.push(_item)
	else
		user.cart.items[_itemIndex].quantity += 1
	console.log("USER IS " + JSON.stringify(user))
	console.log("USER id IS " + JSON.stringify(user._id))

	User.findByIdAndUpdate(ObjectId(user._id), {
		cart : user.cart,
	})
	.then(data => {
		res.redirect('/products')
	})
	.catch(err => {
		console.log(err)
	})

};

exports.deleteItem = (req, res, next) => {
	const productId = req.body.productId
	const user = req.session.user	
	let productIndex = user.cart.items.findIndex(item => item.productId == productId)
	if (!productIndex)
		res.redirect('/cart')
	user.cart.items.splice(productIndex, 1)
	user.save()
	.then(data => {
		res.redirect('/cart')
	})
	.catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
	Order.find()

		.then(orders => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders,
				isLoggedIn : req.session.isLoggedIn
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
	const productsFetchedFromCart = []
	console.log("user is " +  JSON.stringify(req.session.user))
	console.log("user_name is " +  JSON.stringify(req.session.user.mail))
	User.findById(req.session.user._id)
	.populate('cart.items.productId')
	.lean()
	.then(data => {
		data.cart.items.forEach(element => {
			let item = {}
			item.product = {...(element.productId)}
			item.quantity = element.quantity
			productsFetchedFromCart.push(item)
		});
		const order = new Order({
			products  : productsFetchedFromCart,
			user : {
				mail :  req.session.user.mail,
				userId : req.session.user._id
			}	
		})

		order.save()
		.then(data => {
			req.session.user.cart.items = []
			User.findByIdAndUpdate(ObjectId( req.session.user._id), {
				cart : req.session.user.cart
			})
			.then((data)=>{ res.redirect('/orders')})
			.catch(err => console.log("err in order " + err))
		})
		.catch(err => console.log("err in order " + err))
	})
}

