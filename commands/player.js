const { SlashCommandBuilder } = require('discord.js')
const { Player } = require('../models/player.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Manage the player list')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                    .setDescription('Add a new player')
                    .addStringOption(option =>
                        option.setName('player_name')
                            .setDescription('The name of the player')
                            .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                    .setDescription('Remove a player')
                    .addStringOption(option =>
                        option.setName('player_name')
                            .setDescription('The name of the player you want to remove')
                            .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('rename')
                    .setDescription('Rename a player')
                    .addStringOption(option =>
                        option.setName('player_name')
                            .setDescription('The name of the player you want to rename')
                            .setRequired(true))
                    .addStringOption(option =>
                        option.setName('new_player_name')
                            .setDescription('The new name of the player')
                            .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('display')
                    .setDescription('Display the player list')),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'add') {
            const playerNameInput = interaction.options.getString('player_name')
            try {
                await Player.create({ name: playerNameInput })
                return interaction.reply({ content: `**${playerNameInput}** have been added into the player list!`, ephemeral: true })
            }
            catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return interaction.reply({content: `**${playerNameInput}** is already already inside the database.`, ephemeral: true})
                }
                console.error(error)
                return interaction.reply({content: 'Something went wrong when we where adding the player into the list.', ephemeral: true})
            }
        }

        if (interaction.options.getSubcommand() === 'remove') {
            const playerNameInput = interaction.options.getString('player_name')
            const result = await Player.destroy({ where: { name: playerNameInput } })
            
            if (result == 0) // Side note here, from what Ive seen using console.log, result seem to be egual to the number of entry that have been deleted.
            {
                return interaction.reply({ content: `**${playerNameInput}** wasn't found inside the player list!`, ephemeral: true })
            }
            return interaction.reply({ content: `**${playerNameInput}** have been removed from the player list!`, ephemeral: true })
        }

        if (interaction.options.getSubcommand() === 'rename') {
            const playerNameInput = interaction.options.getString('player_name')
            const newPlayerNameInput = interaction.options.getString('new_player_name')
            const result = await Player.update({ name: newPlayerNameInput }, { where: { name: playerNameInput } })

            if (result[0] == 0)
            {
                return interaction.reply({ content: `**${playerNameInput}** wasn't found inside the player list!`, ephemeral: true })
            }
            
            return interaction.reply({ content: `**${playerNameInput}** have been renamed to **${newPlayerNameInput}**!`, ephemeral: true })
        }

        if (interaction.options.getSubcommand() === 'display') {
            const players = await Player.findAll()
            const playerList = players.map(player => player.name).join(' **, **')
            
            return interaction.reply({ content: `** ${playerList} **`, ephemeral: true })
        }
    }
}