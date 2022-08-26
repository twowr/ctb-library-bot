const fs = require("fs");
const { ActivityType } = require('discord.js')
const { Player, PlayerEvent } = require('../database.js')

const statusPath = "status.txt"

function getRandomLine(filePath){ // This function may have a memory impact if the .txt file become too big.
    var data = fs.readFileSync(filePath, 'utf8')

    const lines = data.split(/\r?\n/) 
    const randomLineNumber = Math.floor(Math.random() * lines.length)
    return lines[randomLineNumber]
}

module.exports = {
    name: 'ready',
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}!`)
        await PlayerEvent.sync()
        await Player.sync()
        console.log(`Synchronized all database models!`)

        const currStatus = getRandomLine(statusPath)
        if (currStatus) {
            client.user.setActivity(currStatus, { type: ActivityType.Listening })

            var minutes = 60
            var intervalTimer = minutes * 60 * 1000;
            setInterval(function() {
                var newStatus = getRandomLine(statusPath)
                while (newStatus == currStatus) {newStatus = getRandomLine(statusPath)}

                client.user.setActivity(newStatus, { type: ActivityType.Listening })
            }, intervalTimer);
        }

    }
}
