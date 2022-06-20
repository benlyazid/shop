const db  = require('../util/database')
const sequelize = require('../util/database').sequelize
const Sequelize = require('sequelize');

const Product = sequelize.define('product' ,{
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title : {
        allowNull: false,
        type: Sequelize.STRING,
    },
    price : {
        allowNull: false,
        type: Sequelize.DOUBLE,
    },
    imageUrl : {
        allowNull: false,
        type: Sequelize.STRING,

    },
    description : {
        allowNull: false,
        type: Sequelize.STRING,
    }
})
module.exports = Product;