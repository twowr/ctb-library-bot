const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')
const { Player, PlayerEvent } = require('../database.js')
const player = require('../models/player.js')

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
                    .setDescription('Display the player list'))
        .addSubcommand(subcommand =>
            subcommand.setName('events')
                    .setDescription('Display all events owned by the player')
                    .addStringOption(option =>
                        option.setName('player_name')
                            .setDescription('The name of the player')
                            .setRequired(true))),
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
            await interaction.deferReply({ephemeral: true })
            const players = await Player.findAll() // Embed Fiels limits is 25, if a 26e entry exist, the next page button gonna show up.
            const playersLength = players.length - 1// Since .lenght do not take in account the fact that the first ID in the table is 0, it mean that the entry 25 will be the entry 26
            const indexPerPage = 19; // Number of values that can be displayed in one page. (NOTE THAT DUE TO A ERROR INTO THE CODE, THE VALUE MAY VARY FROM 1 TO 2 BIGGER OR SMALLER)
            var playersIndex = 0

            const listEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Players')
                .setTimestamp();

            if (playersLength >= 25) { 
                const collectorButton = interaction.channel.createMessageComponentCollector({ComponentType: ComponentType.Button ,time: 600000 })

                collectorButton.on('collect', async i => {
                    if (i.user.id === interaction.user.id) {
                        await i.deferUpdate();
                        var embedNameListDescription = " "
                        
                        if (i.customId == "next") {
                            var currentPlayerIndex = playersIndex
                            for (playersIndex; playersIndex <= (indexPerPage + currentPlayerIndex) ; playersIndex++) {
                                if (!players[playersIndex]) { playersIndex--; break;}
                                embedNameListDescription += `**${players[playersIndex].name}**\r\n`
                            }
                        } else if (i.customId == "back") {
                            var lastPlayerIndex = playersLength - playersIndex
                            for (let index = lastPlayerIndex; index <= (lastPlayerIndex + indexPerPage); index++) {
                                if (!players[index]) {break;}
                                playersIndex = index
                                embedNameListDescription += `**${players[index].name}**\r\n`
                            } 
                        }
                        listEmbed.setFooter({ text: `Showing ${playersIndex}/${playersLength}`})
                        listEmbed.setDescription(embedNameListDescription)
                        

                        var nextButtonDisabled = true;
                        if (playersIndex < playersLength) { 
                            nextButtonDisabled = false;
                        }
                        var backButtonDisabled = true;
                        if (playersIndex > indexPerPage) { 
                            backButtonDisabled = false;
                        }
            
                        const ButtonsRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('back')
                                    .setLabel('Back')
                                    .setEmoji('◀️')
                                    .setDisabled(backButtonDisabled)
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId('next')
                                    .setLabel('Next')
                                    .setEmoji('▶️')
                                    .setDisabled(nextButtonDisabled)
                                    .setStyle(ButtonStyle.Primary),
                            );

                        i.editReply({ephemeral: true , components: [ButtonsRow] , embeds: [listEmbed]})
                    } else {
                        i.reply({ content: `You are not allowed to interact with this!`, ephemeral: true });
                    }
                });
            }

            var embedNameListDescription = ""
            for (playersIndex; playersIndex <= indexPerPage; playersIndex++) {
                if (!players[playersIndex]) { playersIndex--; break;}
                embedNameListDescription += `**${players[playersIndex].name}**\r\n`
            } 
            listEmbed.setDescription(embedNameListDescription)
            listEmbed.setFooter({ text: `Showing ${playersIndex}/${playersLength}`})

            var nextButtonDisabled = true;
            if (playersIndex < playersLength) { 
                nextButtonDisabled = false;
            }

            const ButtonsRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('back')
                        .setLabel('Back')
                        .setEmoji('◀️')
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setEmoji('▶️')
                        .setDisabled(nextButtonDisabled)
                        .setStyle(ButtonStyle.Primary),
                );

            return await interaction.editReply({ephemeral: true , components: [ButtonsRow] , embeds: [listEmbed]})
        }

        if (interaction.options.getSubcommand() === 'events') {
            await interaction.deferReply({ephemeral: true })
            const playerNameInput = interaction.options.getString('player_name')
            const playerData = await Player.findOne({ where: { name: playerNameInput } })

            if (!playerData) {
                return await interaction.editReply({ content: `**${playerNameInput}** wasn't found inside the player list.`, ephemeral: true })
            }
            const playerEvents = await PlayerEvent.findAll({ where: { PlayerId: playerData.id } }) // Search inside all playerEvents for all PlayerId value matching the ID of the asked player.
            const eventList = playerEvents.map(playerEvents => playerEvents.event_id).join(' **, **')
            return await interaction.editReply({ content: `**${eventList} **`, ephemeral: true })
        }
    }
}