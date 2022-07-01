const Product = require('../models/model.product');
const { ObjectId } = require('mongodb');


exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: "",
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product({title  : title, price : price, description :  description, imageUrl  : imageUrl, userId : req.user._id});
	product.save()
		.then((data) => {
			console.log("DATA HAS BEEN INSERTED....")
			console.log(data)
			res.redirect('/products');
		})
		.catch(err => console.log(err))
};


exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit
	const productId = req.params.productId;
	Product.findById(productId)
		.then((product) => {
			if (!product)
				return res.redirect('/')
			console.log("__REQ IS " + product._id)
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product
			})
		})
		.catch(err => console.log(err))
};

exports.postEditProduct = (req, res, next) => {
	const productId = req.query.productId
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	Product.findByIdAndUpdate(ObjectId(productId), {
		title : title,
		imageUrl : imageUrl,
		description : description,
		price : price,
		userId : req.user._id
	})
	.then(data => {
		console.log(data)
		res.redirect('/')
	})
	.catch(err => {
		if (err)
			console.log(err)
	})
}

exports.getProducts = (req, res, next) => {
	Product.find().then(products => {
		console.log(products[0]._id)
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products'
		})
	})
		.catch(err => {
			if (err)
				console.log(err)
		})
};

exports.deleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.findByIdAndDelete(productId)
	.then(data => {
		console.log(data)
		res.redirect('/admin/products')
	}).catch(err => {
		if (err)
			console.log(err)
	})
}