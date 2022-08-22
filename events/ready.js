const { ActivityType } = require('discord.js')

const { PlayerEvent } = require('../models/playerEvent.js')
const { Player } = require('../models/player.js')

module.exports = {
    name: 'ready',
    async execute(client) {
        PlayerEvent.sync()
        Player.sync()

        client.user.setActivity('黒皇帝 - Scattered Faith', { type: ActivityType.Listening })
        console.log(`Logged in as ${client.user.tag}!`)
    }
}
