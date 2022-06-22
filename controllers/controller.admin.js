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
  // product.save();
  // product.insertProductInDatabase()
  req.user.createProduct({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
  }).then(data => {
    console.log("DATA HAS BEEN INSERTED....")
    console.log(data)
    res.redirect('/');
  }).catch(err => {
    console.log("ERROR HAS BEEN FOUND :( ")
    console.log(err)
  })

};


exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  const productId = req.params.productId;
  req.user.getProducts({where: { id : productId,}}).then(products =>{
    const product = products[0]
  // Product.findByPk(productId).then(product => {
    console.log(product)
    console.log(product.title)
    console.log(productId)
    if (!product)
      return res.redirect('/')
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    })

  }).catch(err => {
    if (err)
      console.log(err)
  })

};

exports.postEditProduct = (req, res, next) => {
  const productId = req.query.productId
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, price, productId);
  Product.update({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  },
    {
      where: {
        id: productId
      }
    }).then(data => {
      console.log(data)
      res.redirect('/')
    }).catch(err => {
      if (err)
        console.log(err)
    })
}


exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
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
  Product.destroy({
    where: {
      id: productId
    }
  }).then(data => {
    console.log(data)
    res.redirect('/admin/products')
  }).catch(err => {
    if (err)
      console.log(err)
  })
}

// http://store/produts/159 req.params 
// http://store/produts?productId=159 req.query