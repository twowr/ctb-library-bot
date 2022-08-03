const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('reply with test'),
	async execute(interaction) {
		await interaction.reply('test');
	},
};
