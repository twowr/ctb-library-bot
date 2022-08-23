require('dotenv').config()

const fs = require('fs')
const path = require('path')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord.js')

const commands = []
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	commands.push(command.data.toJSON())
}

const rest = new REST({ version: '10' }).setToken(process.env.client_token)

rest.put(Routes.applicationCommands(process.env.client_id), { body: commands })
	.then(() => console.log('Successfully registered commands.'))
	.catch(console.error)

/*rest.delete(Routes.applicationCommand(process.env.client_id, 'command id'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error)
*/
