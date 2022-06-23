const Product = require('../models/model.product');
const Cart = require('../models/model.cart');
const User = require('../models/model.user');

exports.getProducts = (req, res, next) => {
	Product.findAll().then(data => {
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
	Product.findByPk(productId).then(product => {
		if (!product)
			res.redirect('/products')
		res.render('shop/product-detail', {
			product: product,
			pageTitle: product.title,
			path: '/products'
		});
	})
		.catch(err => {
			console.log("ERROR IN FINDING PRODUCT BY INDEX : " + err)
		})
};

exports.getIndex = (req, res, next) => {
	Product.findAll().then(data => {
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
					console.log("PRODUCTS ARE \n\n" + products + "\n\n" +  products[0].title)
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
	.then(cart =>{
		fetchedCart = cart;
		return cart.getProducts({where : {
			id : productId
		}})
	})
	.then(products => {
		let product;
		if (products.length > 0){
			product = products[0]
		}
		if (product){ //? product already exesiste in cart
			//> Update Product quantity
			const oldQuantity = product.cartItem.quantity
			newQuantity = oldQuantity + 1;
			return product
		}
		return Product.findByPk(productId)
	})
	.then(product => {
		console.log("PRODUCT IS " + product + " quatity " + newQuantity)
		return fetchedCart.addProduct(product, {through : 
		{
			quantity : newQuantity
		}
		})
	})
	.then(ans =>res.redirect('/products'))
	.catch(
		err => console.log("error is : ", err))
};

exports.deleteItem = (req, res, next) => {
	const productId = req.body.productId
	// Cart.deleteProduct(productId, () => {
	// 	res.redirect('/cart');
	// })
	req.user.getCart()
	.then(cart => {
		console.log("CART IS " + cart)
		return cart.getProducts({where : { id : productId}})
	})
	.then(products => {
		console.log("products getted from cart are " +  products + products.length)
	})
	.catch(err => console.log(err)) //of get cart
}

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders'
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	});
};
