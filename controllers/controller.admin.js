const Product = require('../models/model.product');
const fs = require('fs');

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
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
exports.deleteProduct = (req, res, next)=>{
  console.log(req.body.productId)
  res.redirect('/')
  
}
// http://store/produts/159 req.params 
// http://store/produts?productId=159 req.query