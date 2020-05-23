const { DataTypes } = require('sequelize')
const DataBase = require('./index')

const WholeSellers = DataBase.define('whole_sellers', {
    wholeseller_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    logo: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    code: {
        type: DataTypes.STRING
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

module.exports = WholeSellers