const { ActivityType } = require('discord.js')

const { History } = require('../models/history.js')
const { Player } = require('../models/player.js')

module.exports = {
    name: 'ready',
    async execute(client) {
        History.sync()
        Player.sync()

        client.user.setActivity('黒皇帝 - Scattered Faith', { type: ActivityType.LISTENING })
        console.log(`Logged in as ${client.user.tag}!`)
    }
}
