const sequelize = require('../util/database').sequelize
const Sequelize = require('sequelize')

const CartItem = sequelize.define('cartItem', {
	id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
	},
    quantity : {
        type: Sequelize.INTEGER,
	},
})
module.exports = CartItem;