const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    // console.log(fileContent)
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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
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
  
  static updateProductById({title, id, imageUrl, description, price}, cb){
    getProductsFromFile(products =>{
      const product = products.find(p => p.id == id);
      if (!product){
        return;
      }
      products.forEach(product => {
          if (product.id == id){
            product.id = id
            product.title = title
            product.imageUrl = imageUrl
            product.description = description
            product.price = price
          }
      });
      cb(p, products)
    })
  }
};


/**
 */
