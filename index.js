require('dotenv').config()

const { Client, GatewayIntentBits } = require('discord.js')
const { token, client_id } = process.env

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
	console.log('Ready!');
});

client.login(token);