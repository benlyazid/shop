const Product = require('../models/model.product');
const fs = require('fs');
const { getAllProducts } = require('../models/model.cart');

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
  const product = new Product(title, imageUrl, description, price);
  product.save();
  product.insertProductInDatabase()
  res.redirect('/');
};


exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  const productId = req.params.productId;
  Product.findById(productId, product=>{

    if (!product )
      return  res.redirect('/')
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product : product
    })
  });
};

exports.postEditProduct = (req, res, next)=> {
  const productId = req.query.productId
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, price, productId);
  Product.updateProductById(product, (_path, product) =>{
    fs.writeFile(_path, JSON.stringify(product), err => console.log("error in writing in file : " + err))
  })
  res.redirect('/')
}

exports.getProducts = (req, res, next) => {
  Product.getAllProductsFromDatabase().then(([data, info]) => {
    console.log(data)
    res.render('admin/products', {
      prods: data,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    })
  })
  .catch(err => {
    console.log(err)
  })
};

exports.deleteProduct = (req, res, next)=>{
  const productId = req.body.productId;
  Product.deleteProductById(productId, (_path, product)=>{
    fs.writeFile(_path, JSON.stringify(product), err => console.log("error in writing in file : " + err))
  })
  res.redirect('/admin/products')
  
}

// http://store/produts/159 req.params 
// http://store/produts?productId=159 req.query