const sequelize = require('../config/db');
const User = require('./user');
const Token = require('./token');

User.hasMany(Token);
Token.belongsTo(User);

sequelize.sync({ alter: true });

module.exports = { sequelize, User, Token };
