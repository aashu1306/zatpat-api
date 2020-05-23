const { DataTypes } = require('sequelize')
const DataBase = require('./index')

const UsersRole = DataBase.define('users_role', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_role: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: false,
})
module.exports = UsersRole