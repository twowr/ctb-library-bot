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
                        option.setName('playername')
                            .setDescription('The name of the player')
                            .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                    .setDescription('Remove a player')
                    .addStringOption(option =>
                        option.setName('playername')
                            .setDescription('The name of the player you want to remove')
                            .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('rename')
                    .setDescription('Rename a player')
                    .addStringOption(option =>
                        option.setName('playername')
                            .setDescription('The name of the player you want to rename')
                            .setRequired(true))
                    .addStringOption(option =>
                        option.setName('newplayername')
                            .setDescription('The new name of the player')
                            .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('display')
                    .setDescription('Display the player list')),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'add') {
            const playername = interaction.options.getString('playername')
            try {
                const player = await Player.create({ playername: playername })
                return interaction.reply({ content: `Player added!`, ephemeral: true })
            }
            catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return interaction.reply({content: 'That player already in the database.', ephemeral: true})
                }
    
                return interaction.reply({content: 'Something went wrong with adding the player.', ephemeral: true})
            }
        }

        if (interaction.options.getSubcommand() === 'remove') {
            const playername = interaction.options.getString('playername')
            await Player.destroy({ where: { playername: playername } })

            return interaction.reply({ content: `Player removed!`, ephemeral: true })
        }

        if (interaction.options.getSubcommand() === 'rename') {
            const playername = interaction.options.getString('playername')
            const newplayername = interaction.options.getString('newplayername')
            await Player.update({ playername: newplayername }, { where: { playername: playername } })

            return interaction.reply({ content: `Player renamed!`, ephemeral: true })
        }

        if (interaction.options.getSubcommand() === 'display') {
            const players = await Player.findAll()
            const playerlist = players.map(player => player.playername).join(', ')
            
            return interaction.reply({ content: `The player list is: ${playerlist}`})
        }
    }
}