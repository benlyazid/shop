const sequelize = require('../util/database').sequelize
const Sequelize = require('sequelize')

const Order = sequelize.define('order', {
	id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
	},
})
module.exports = Order;