const { ActivityType } = require('discord.js')

const { Player, PlayerEvent } = require('../database.js')

const fs = require("fs");
const statusPath = "status.txt"

function getRandomLine(filePath){ // Bad Performances with big .txt files, would need a fix later.
    var data = fs.readFileSync(filePath, 'utf8')

    const lines = data.split(/\r?\n/) 
    const randomLineNumber = Math.floor(Math.random() * lines.length)
    return lines[randomLineNumber]
}

module.exports = {
    name: 'ready',
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}!`)
        PlayerEvent.sync()
        Player.sync()

        client.user.setActivity(getRandomLine(statusPath), { type: ActivityType.Listening })

        var minutes = 60, intervalTimer = minutes * 60 * 1000;
        setInterval(function() {
            client.user.setActivity(getRandomLine(statusPath), { type: ActivityType.Listening })
        }, intervalTimer);
    }
}
