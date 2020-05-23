const { DataTypes } = require('sequelize')
const DataBase = require('./index')

const Retailer = DataBase.define('retailers', {
    retailer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    retailer_wholeseller_id: DataTypes.INTEGER,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    mobile: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    aadhar_no: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    details: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: "INACTIVE"
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, { timestamps: false })

module.exports = Retailer