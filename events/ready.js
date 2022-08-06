const { History, player } = require('../models/history.js')

module.exports = {
    name: 'ready',
    async execute(client) {
        History.sync()
        player.sync()
        console.log(`Logged in as ${client.user.tag}!`)
    }
}
