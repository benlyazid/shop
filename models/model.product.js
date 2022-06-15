const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err || !fileContent) {
      cb([]);
    } else {
      try{
        cb(JSON.parse(fileContent));
      }
      catch(e){
        cb([]);
      }
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = id;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
  
  static updateProductById(updadted_product, cb){
    getProductsFromFile(products =>{
      const product_index = products.findIndex(p => p.id == updadted_product.id);
      if (product_index == -1){
        return;
      }
      products[product_index] = updadted_product;
      cb(p, products)
    })
  }
};


/**
 */
