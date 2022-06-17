const mysql = require('mysql2')

const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "root",
	database: "shop"
	
});
//todo learn more about defferent between connection and pool

const createIfNotExist = () => {
	let _pool = mysql.createPool({
		host: "localhost",
		user: "root",
		password: "root",
	})
	_pool.promise().execute('CREATE DATABASE IF NOT EXISTS shop')
	.then(msg => {
		console.log('DATABASE CREATED....')
		// console.log(msg)
		_pool = mysql.createPool({
			host: "localhost",
			user: "root",
			password: "root",
			database: "shop"
			})
			_pool.promise().execute('CREATE TABLE IF NOT EXISTS products (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL UNIQUE, title VARCHAR(255) NOT NULL, price DOUBLE NOT NULL, description VARCHAR(255) NOT NULL, imageURL VARCHAR(255) NOT NULL)')
			.then(msg =>{
				console.log('TABLE CREATED....')
				// console.log(msg)
			})
			.catch(err =>{
				console.log('ERROR IN CRIEATING TABLE....')
				console.log(err)
			})
		})
		.catch(err => {
			console.log('ERROR IN CRIEATING DATABSE....')
			console.log(err)				
		})
}



module.exports = {db_pool : pool.promise(), createIfNotExist : createIfNotExist}




/*                CREATE DATABASE

CREATE DATABASE IF NOT EXISTS shop;
*/

/*                  CREATE TABLE
CREATE TABLE IF NOT EXISTS products (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL UNIQUE, title VARCHAR(255) NOT NULL, price DOUBLE NOT NULL, description VARCHAR(255) NOT NULL, imageURL VARCHAR(255) NOT NULL);
*/

/*                  INSERT DATA
INSERT INTO products (title, price, description, imageURL) VALUES ('product_0', '120', 'This is a simple description of a pproduct', 'image_URL');
*/

