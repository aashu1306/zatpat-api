const { DataTypes } = require('sequelize')
const DataBase = require('./index')

const UserRoles = DataBase.define('user_roles', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    roleId: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: false,
})
module.exports = UserRoles