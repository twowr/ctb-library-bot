const { History } = require('../models/history.js')
const { Player } = require('../models/player.js')

module.exports = {
    name: 'ready',
    async execute(client) {
        History.sync()
        Player.sync()
        console.log(`Logged in as ${client.user.tag}!`)
    }
}
