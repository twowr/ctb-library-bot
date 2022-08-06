const { SlashCommandBuilder } = require('discord.js')
const { History } = require('../models/history.js')

module.exports = {
	data: new SlashCommandBuilder()
    .setName('event')
    .setDescription('Manage the player wiki')
    .addSubcommand(subcommand =>
        subcommand.setName("add")
                .setDescription("Add a new event") 
                .addStringOption(option =>
                    option.setName('playername')
                        .setDescription('From which player is this event from?')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('when')
                        .setDescription('format:YYYY-MM-DD')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('whathappened')
                        .setDescription('Basically a title, make it short')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('witi')
                        .setDescription('Why is that important')
                        .setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand.setName("remove")
                .setDescription("Remove an event")
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('The id of the event to remove')
                        .setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand.setName("edit")
                .setDescription("Edit an event")
                .addStringOption(option =>
                        option.setName('id')
                            .setDescription('The id of the event to edit')
                            .setRequired(true))),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'add') {
            const player = interaction.options.getString('playername')
            const when = interaction.options.getString('when')
            const whathappened = interaction.options.getString('whathappened')
            const witi = interaction.options.getString('witi')

            const history = await History.create({
                player: player,
                when: when,
                whp: whathappened,
                witi: witi,
            })

            return interaction.reply({ content: `Event added!`, ephemeral: true })
        }
        
        if (interaction.options.getSubcommand() === 'remove') {
            const id = interaction.options.getString('id')
            const history = await History.findByPk(id)
            await history.destroy()
            return interaction.reply({ content: `Event removed!`, ephemeral: true })
        }
    }
}