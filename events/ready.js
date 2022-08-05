const { History } = require('../models/history.js')

module.exports = {
    name: 'ready',
    execute(client) {
        History.sync()
        console.log(`Logged in as ${client.user.tag}!`)
    }
}
