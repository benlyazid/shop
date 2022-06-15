const fs = require('fs');
const path = require('path');

const p = path.join(
	path.dirname(process.mainModule.filename),
	'data',
	'cart.json'
);
const readCartFile = (cb) => {
	fs.readFile(p, (err, fileContent) => {
		let cart = { products: [], totalPrice: 0 };
		if (!err) {
			try {
				cart = JSON.parse(fileContent);
			}
			catch (e) {
			}
			cb(cart)
		}
	})
}

module.exports = class Cart {
	static addProduct(product, cb) {

		readCartFile(cart => {
			// Analyze the cart => Find existing product
			const existingProductIndex = cart.products.findIndex(
				prod => prod.id === product.id
			);
			const existingProduct = cart.products[existingProductIndex];
			let updatedProduct;
			// Add new product/ increase quantity
			if (existingProduct) {
				updatedProduct = { ...existingProduct };
				updatedProduct.qty = updatedProduct.qty + 1;
				cart.products = [...cart.products];
				cart.products[existingProductIndex] = updatedProduct;
			} else {
				updatedProduct = { productData: product, id: product.id, qty: 1 };
				cart.products = [...cart.products, updatedProduct];
			}
			cart.totalPrice = cart.totalPrice + +product.price;
			fs.writeFile(p, JSON.stringify(cart), err => {
				if(err)
					console.log("error in writing into file : " + p + " error is " + err);
				cb()
			});
		});
	}

	static getAllProducts(cb) {
		readCartFile(cb)
	}

	static deleteProduct(productId, cb) {
		let productIndex = -1
		let productPrice = 0
		//! don't forget to decreasse totalPrice
		readCartFile(cart => {
			cart.products.forEach(product => {
				if (product.id == productId) {
					productPrice = Number(product.productData.price)
					productIndex = cart.products.indexOf(product)
					//break
				}
			});
			if (cart.products[productIndex].qty == 1) {
				cart.products.splice(productIndex, 1)
			}
			else {
				cart.products[productIndex].qty = cart.products[productIndex].qty - 1
			}
			cart.totalPrice = cart.totalPrice - productPrice
			fs.writeFile(p, JSON.stringify(cart), err => {
				console.log("error in writing into file in delete: " + p + " error is " + err);
				cb()
			});
		})
	}

};
//! there is a bug in rendering page after delete in cart and adding to cart
