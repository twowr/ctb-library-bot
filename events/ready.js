const { History } = require('../models/history.js')
const { Player } = require('../models/player.js')

module.exports = {
    name: 'ready',
    async execute(client) {
        History.sync()
        Player.sync()

        client.user.setActivity('is catching the beat')
        console.log(`Logged in as ${client.user.tag}!`)
    }
}
