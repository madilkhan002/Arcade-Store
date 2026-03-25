const connection = require('../config/sqlConnection');
const User = require('./User');
const Admin = require('./Admin');
const Game = require('./Game');
const Comment = require('./Comment');
const BillReport = require('./BillReport');
const { DataTypes } = require('sequelize');

// Define Wishlist through table explicitly
const Wishlist = connection.define('Wishlist', {
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: { model: User, key: 'email' }
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: Game, key: 'id' }
    }
}, {
    tableName: 'wishlist',
    timestamps: false
});

// Define Cart through table explicitly
const Cart = connection.define('Cart', {
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: { model: User, key: 'email' }
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: Game, key: 'id' }
    }
}, {
    tableName: 'cart',
    timestamps: false
});

// Associations
User.belongsToMany(Game, { through: Wishlist, foreignKey: 'email', otherKey: 'id', as: 'WishlistGames' });
Game.belongsToMany(User, { through: Wishlist, foreignKey: 'id', otherKey: 'email' });
Wishlist.belongsTo(Game, { foreignKey: 'id' });
Game.hasMany(Wishlist, { foreignKey: 'id' });

User.belongsToMany(Game, { through: Cart, foreignKey: 'email', otherKey: 'id', as: 'CartGames' });
Game.belongsToMany(User, { through: Cart, foreignKey: 'id', otherKey: 'email' });
Cart.belongsTo(Game, { foreignKey: 'id' });
Game.hasMany(Cart, { foreignKey: 'id' });

User.hasMany(BillReport, { foreignKey: 'email' });
BillReport.belongsTo(User, { foreignKey: 'email' });

Game.hasMany(Comment, { foreignKey: 'gameid' });
Comment.belongsTo(Game, { foreignKey: 'gameid' });

module.exports = {
    connection,
    User,
    Admin,
    Game,
    Comment,
    BillReport,
    Wishlist,
    Cart
};