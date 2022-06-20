const sequelize = require('../util/database').sequelize
const Sequelize = require('sequelize')

const User = sequelize.define('user', {
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name : {
        allowNull: false,
        type: Sequelize.STRING,
    },
    mail : {
        allowNull: false,
        type: Sequelize.STRING,
    }
})

module.exports = User;