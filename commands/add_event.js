const { SlashCommandBuilder } = require('discord.js')
const { History } = require('../models/history.js')

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
		const player_name = interaction.options.getString('playername')
        const when = interaction.options.getString('when')
        const what_happened = interaction.options.getString('whathappened')
        const witi = interaction.options.getString('witi')

        try {
            const hystory = await History.create({
                name: player_name,
                when: when,
                what_happened: what_happened,
                witi: witi,
            })

            return interaction.reply(`Added new event for ${player_name}`)
        }
        catch (error) {
            return interaction.reply('Something went wrong with adding a event')
        }
	}
}