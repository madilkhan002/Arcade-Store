const { DataTypes } = require('sequelize');
const connection = require('../config/sqlConnection');

const Admin = connection.define('Admin', {
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    _password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'admins',
    timestamps: false
});

module.exports = Admin;