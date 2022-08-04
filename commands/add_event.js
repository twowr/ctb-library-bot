const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addevent')
		.setDescription('add-a-new-event')
        .addStringOption(option =>
            option.setName('playername')
                .setDescription('which-player-is-this-event-from?')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('when')
                .setDescription('format:YYYY-MM-DD')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('whathappened')
                .setDescription('basically-a-title,-make-it-short-or-UI-look-weird')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('witi')
                .setDescription('why-is-that-important')
                .setRequired(true)),
	async execute(interaction) {
		await interaction.reply(`added a new event for ${interaction.options.getString('playername')} on ${interaction.options.getString('when')} with ${interaction.options.getString('whathappened')} and ${interaction.options.getString('witi')}`);
	},
};