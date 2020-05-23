const { DataTypes } = require('sequelize')
const DataBase = require('./index')
const bcrypt = require('bcryptjs');

const User = DataBase.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        set(value) {
            var password = bcrypt.hashSync(value, 12)
            this.setDataValue('password', password);
        }
    },
    mobile: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: "INACTIVE"
    }
}, {
    timestamps: false,
})
User.prototype.isPasswordMatched = function (password) {
    return bcrypt.compare(password, this.password)
}
module.exports = User