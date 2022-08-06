const { SlashCommandBuilder } = require('discord.js')
const { Player } = require('../models/player.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Manage the player list')
        .addSubcommand(subcommand =>
            subcommand.setName("add")
                    .setDescription("Add a new player")
                    .addStringOption(option =>
                        option.setName('playername')
                            .setDescription('The name of the player')
                            .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("remove")
                    .setDescription("Remove a player")
                    .addStringOption(option =>
                        option.setName('playername')
                            .setDescription('The name of the player you want to remove')
                            .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("rename")
                    .setDescription("Rename a player")
                    .addStringOption(option =>
                        option.setName('playername')
                            .setDescription('The name of the player you want to rename')
                            .setRequired(true))
                    .addStringOption(option =>
                        option.setName('newplayername')
                            .setDescription('The new name of the player')
                            .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("display")
                    .setDescription("Display the player list")),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'add') {
            const playername = interaction.options.getStringOption('playername')
            const player = await Player.create({
                playername: playername,
            })
        }

        if (interaction.options.getSubcommand() === 'remove') {
            const playername = interaction.options.getStringOption('playername')
            await Player.destroy({ where: { playername: playername } })
        }

        if (interaction.options.getSubcommand() === 'rename') {
            const playername = interaction.options.getStringOption('playername')
            const newplayername = interaction.options.getStringOption('newplayername')
            await Player.update({ playername: newplayername }, { where: { playername: playername } })
        }

        if (interaction.options.getSubcommand() === 'display') {
            const players = await Player.findAll()
            const playerlist = players.map(player => player.playername).join(', ')
            await interaction.reply({ content: `The player list is: ${playerlist}`, ephemeral: true })
        }
    }
}