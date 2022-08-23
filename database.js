const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
})

const Player = require('./models/player')(sequelize, Sequelize)
const PlayerEvent = require('./models/playerEvent')(sequelize, Sequelize)

PlayerEvent.belongsTo(Player, { as: 'Player' })

module.exports = { Player, PlayerEvent }