const fs = require('fs');
const path = require('path');
const db  = require('../util/database')
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
			try {
				cb(JSON.parse(fileContent));
			}
			catch (e) {
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

	static getAllProductsFromDatabase(){
		let query = 'SELECT * FROM products';
		return db.db_pool.execute(query);
		// .then(data =>{
		// 	console.log(data[0])
		// })
		// .catch(err =>{
		// 	console.log(err)
		// })
	}

	insertProductInDatabase(){
		let  query = 'INSERT INTO products (title, price, description, imageUrl)'
		query += `VALUES ('${this.title}', '${this.price}', '${this.description}', '${this.imageUrl}')`
		console.log(query)
		db.db_pool.execute(query)
		.then(msg =>{
			console.log("DATA INSERTED")
		})
		.catch(err =>{
			console.log("ERROR IN INSERTING DATA :(")
			console.log(err)
		})
	}

	static findById(id, cb) {
		getProductsFromFile(products => {
			const product = products.find(p => p.id === id);
			cb(product);
		});
	}

	static updateProductById(updadted_product, cb) {
		getProductsFromFile(products => {
			const product_index = products.findIndex(p => p.id == updadted_product.id);
			if (product_index == -1) {
				return;
			}
			products[product_index] = updadted_product;
			cb(p, products)
		})
	}


	static deleteProductById(idToDelete, cb) {
		getProductsFromFile(products => {
			const product_index = products.findIndex(p => p.id == idToDelete);
			if (product_index == -1) {
				return;
			}
			products.splice(product_index, 1);
			cb(p, products)
		})
	}
};

