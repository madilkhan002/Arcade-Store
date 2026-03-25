const { DataTypes } = require('sequelize');
const connection = require('../config/sqlConnection');

const Comment = connection.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gameid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comm: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'comments',
    timestamps: false
});

module.exports = Comment;