const Product = require('../models/model.product');
const Cart = require('../models/model.cart');

exports.getProducts = (req, res, next) => {
	Product.findAll().then(data =>{
		res.render('shop/product-list', {
			prods: data,
			pageTitle: 'All Products',
			path: '/products'
		})
	})
	.catch(err =>{
		if (err)
			console.log(err)
	})
};

exports.getProduct = (req, res, next) => {
	const productId = req.params.productId;
	Product.findByPk(productId).then(product=>{
		if (!product)
			res.redirect('/products')
		res.render('shop/product-detail', {
			product: product,
			pageTitle: product.title,
			path: '/products'
		});
	})
	.catch(err =>{
		console.log("ERROR IN FINDING PRODUCT BY INDEX : " + err)
	})
};

exports.getIndex = (req, res, next) => {
	Product.findAll().then(data =>{
		res.render('shop/index', {
			prods: data,
			pageTitle: 'Shop',
			path: '/'
		})
	})
	.catch(err =>{
		if (err)
			console.log(err)
	})
};

exports.getCart = (req, res, next) => {
	Cart.getAllProducts(cart => {
		res.render('shop/cart', {
			path: '/cart',
			pageTitle: 'Your Cart',
			products: cart.products
		})
	});
};


exports.postCart = (req, res, next) => { // add product as parameter to show it in the cart 
	const prodId = req.body.productId;
	Product.findById(prodId, product => {
		Cart.addProduct(product, () => {
			res.redirect('/products');
		}
		);
	});
};

exports.deleteItem = (req, res, next) => {
	const productId = req.body.productId
	Cart.deleteProduct(productId, () => {
		res.redirect('/cart');
	})
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
