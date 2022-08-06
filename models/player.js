const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
})

const Player = sequelize.define('player', {
    playername: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false,
    }
}, {
    timestamps: false,
})

module.exports = { Player }