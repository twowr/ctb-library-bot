const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
})

const { Player } = require('./player.js')

const PlayerEvent = sequelize.define('event', {
    event_id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    date: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: false,
    },
    title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
})

PlayerEvent.hasOne(Player, { foreignKey: 'Player', as : 'player' })

module.exports = { PlayerEvent }