const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
})

const { Player } = require('./player.js')

const History = sequelize.define('history', {
    section_id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    player: Sequelize.DataTypes.STRING,

    when: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: false,
    },
    whp: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    witi: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
})

History.belongsTo(Player, { foreignKey: 'player', as : 'name' })

module.exports = { History }