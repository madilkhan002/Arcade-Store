const { DataTypes } = require('sequelize');
const connection = require('../config/sqlConnection');

const Game = connection.define('Game', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    _name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    detail: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    catagory: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    stars: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    total: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'games',
    timestamps: false
});

module.exports = Game;