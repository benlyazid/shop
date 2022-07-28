const Product = require('../models/model.product');
const { ObjectId } = require('mongodb');


exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: "",
		isLoggedIn : req.session.isLoggedIn,
		hasError : false,
		errorMessage : false,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const image = req.file
	const price = req.body.price;
	const description = req.body.description;
	if (!image){
		return res.status(422).render('admin/edit-product',{
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editing: "",
			isLoggedIn : req.session.isLoggedIn,
			hasError : true,
			errorMessage : "Attached file is not an image",
			validationErrors : [],
			product : {
				title : title,
				price : price,
				description : description,
			}
		})
	}
	const imageUrl = image.path;
	const product = new Product({title  : title, price : price, description :  description, imageUrl  : imageUrl, userId : req.session.user._id});
	console.log("CHECK FOR 2 " + imageUrl)
	product.save()
		.then((data) => {
			console.log("DATA HAS BEEN INSERTED....")
			console.log(data)
			res.redirect('/products');
		})
		.catch(err => console.log("error is " + err))
};


exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit
	const productId = req.params.productId;
	Product.findById(productId)
		.then((product) => {
			if (!product)
				return res.redirect('/')
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product,
				isLoggedIn : req.session.isLoggedIn,
				hasError : false,
				errorMessage : false,

			})
		})
		.catch(err => console.log(err))
};

exports.postEditProduct = (req, res, next) => {
	const productId = req.body.productId
	const title = req.body.title;
	const image = req.image
	const price = req.body.price;
	const description = req.body.description;
	let updatedProduct = {
		title : title,
		description : description,
		price : price,
		userId : req.session.user._id
	}
	if (image)
		updatedProduct.imageUrl = image.path

	Product.findByIdAndUpdate(ObjectId(productId), updatedProduct)
	.then(data => {
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
			isLoggedIn : req.session.isLoggedIn,
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