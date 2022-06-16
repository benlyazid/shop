const mysql = require('mysql2')

const pool = mysql.createPool({
    host : "localhost",
    user : "root",
    password : "root",
    database : "shop"

});

module.exports = pool.promise();


/*
INSERT INTO products (title, price, description, imageURL) VALUES ('product_0', '120', 'This is a simple description of a pproduct', 'image_URL');
*/





/**
 * id int  primary-key non-null uniq autoincrement
 * title varchar(255) non-null
 * price double  nonnull
 * description text()  nonnull
 * imageURL varchar(255)  nonnull
 
    CREATE TABLE products (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL UNIQUE, title VARCHAR(255) NOT NULL, price DOUBLE NOT NULL, description VARCHAR(255) NOT NULL, imageURL VARCHAR(255) NOT NULL);
 */