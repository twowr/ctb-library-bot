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
                    .setDescription('Display the player list')
                    .addNumberOption(option => 
                        option.setName('page')
                            .setDescription('You can choose a particular page to start on it')
                            .setMinValue(1)))
        .addSubcommand(subcommand =>
            subcommand.setName('events')
                    .setDescription('Display all events owned by the player')
                    .addStringOption(option =>
                        option.setName('player_name')
                            .setDescription('The name of the player')
                            .setRequired(true))
                    .addNumberOption(option => 
                        option.setName('page')
                            .setDescription('You can choose a particular page to start on it')
                            .setMinValue(1))),
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
            const pageInput = interaction.options.getNumber('page') // Since page input follow the user display, the first number will be 1. We need to do -1 in order to use it with currentPage.
            const players = await Player.findAll()
            const playersLength = players.length // Count the index 0
            const indexPerPage = 20
            const maxPage = Math.ceil(playersLength/indexPerPage) - 1 //ceil return the smallest integer that is bigger than x, subtract 1 because it return the amount of page possible meanwhile we use a page system with starting page equal to 0
            var currentPage = 0 //keep track of the current page

            console.log(playersLength)
            console.log(maxPage)
            const listEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Players')
                .setTimestamp();

            if (playersLength >= indexPerPage) { 
                const collectorButton = interaction.channel.createMessageComponentCollector({ComponentType: ComponentType.Button ,time: 600000 })

                collectorButton.on('collect', async i => {
                    if (i.user.id === interaction.user.id) {
                        await i.deferUpdate();
                        var embedListDescription = " "
                        
                        if (i.customId == "next") {
                            //loop from smallest index in current page to the highest
                            //Explanation for short brain : currentPage++ set the next page that will be loaded, then (currentPage+1)*indexPerPage get the first index of the next page and then do -1 to get the last index of the page that will be loaded
                            currentPage++
                            for (let index = (currentPage*indexPerPage); index <= ((currentPage+1) * indexPerPage) -1 ; index++) {
                                if (!players[index]) {break;}
                                embedListDescription += `**${index+1}: ${players[index].name}**\r\n`
                            }
                        } else if (i.customId == "back") {
                            currentPage--
                            for (let index = (currentPage*indexPerPage); index <= ((currentPage+1) * indexPerPage) -1 ; index++) {
                                if (!players[index]) {break;}
                                embedListDescription += `**${index+1}: ${players[index].name}**\r\n`
                            }
                        }
                        listEmbed.setFooter({ text: `Showing page ${currentPage+1}/${maxPage+1}`})
                        listEmbed.setDescription(embedListDescription)

                        var nextButtonDisabled = true;
                        if (currentPage < maxPage) {
                            nextButtonDisabled = false;
                        }
                        var backButtonDisabled = true;
                        if (currentPage > 0) { 
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

            if (pageInput) {
                if ( (pageInput - 1) > maxPage ) {
                    return await interaction.editReply({ content: `The page **${pageInput}** is invalid.`, ephemeral: true })
                }
                currentPage = pageInput - 1
            }

            var embedListDescription = " "
            for (let index = (currentPage*indexPerPage); index <= ((currentPage+1) * indexPerPage) -1 ; index++) {
                if (!players[index]) {break;}
                embedListDescription += `**${index+1}: ${players[index].name}**\r\n`
            }
            listEmbed.setFooter({ text: `Showing page ${currentPage+1}/${maxPage+1}`})
            listEmbed.setDescription(embedListDescription)

            var nextButtonDisabled = true;
            if (currentPage < maxPage) {
                nextButtonDisabled = false;
            }
            var backButtonDisabled = true;
            if (currentPage > 0) { 
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

            return await interaction.editReply({ephemeral: true , components: [ButtonsRow] , embeds: [listEmbed]})
        }

        if (interaction.options.getSubcommand() === 'events') {
            await interaction.deferReply({ephemeral: true })
            const playerNameInput = interaction.options.getString('player_name')
            const pageInput = interaction.options.getNumber('page')
            const playerData = await Player.findOne({ where: { name: playerNameInput } })

            if (!playerData) {
                return await interaction.editReply({ content: `**${playerNameInput}** wasn't found inside the player list.`, ephemeral: true })
            }
            const playerEvents = await PlayerEvent.findAll({ where: { PlayerId: playerData.id } }) // Search inside all playerEvent for PlayerId value matching the ID of the asked player ID and then return a table.
            const playerEventsLength = playerEvents.length
            const indexPerPage = 20
            const maxPage = Math.ceil(playerEventsLength/indexPerPage) - 1 //ceil return the smallest integer that is bigger than x, subtract 1 because it return the amount of page possible meanwhile we use a page system with starting page equal to 0
            var currentPage = 0 //keep track of the current page

            const listEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Events ID for ${playerNameInput}`)
                .setTimestamp();

            if (playerEventsLength >= indexPerPage) { 
                const collectorButton = interaction.channel.createMessageComponentCollector({ComponentType: ComponentType.Button ,time: 600000 })

                collectorButton.on('collect', async i => {
                    if (i.user.id === interaction.user.id) {
                        await i.deferUpdate();
                        var embedListDescription = " "
                        
                        if (i.customId == "next") {
                            //loop from smallest index in current page to the highest
                            //Explanation for short brain : currentPage++ set the next page that will be loaded, then (currentPage+1)*indexPerPage get the first index of the next page and then do -1 to get the last index of the page that will be loaded
                            currentPage++
                            for (let index = (currentPage*indexPerPage); index <= ((currentPage+1)*indexPerPage) -1 ; index++) {
                                if (!playerEvents[index]) {break;}
                                embedListDescription += `**${index+1}: ${playerEvents[index].event_id}**\r\n`
                            }
                        } else if (i.customId == "back") {
                            currentPage--
                            for (let index = (currentPage*indexPerPage); index <= ((currentPage+1)*indexPerPage) -1 ; index++) {
                                if (!playerEvents[index]) {break;}
                                embedListDescription += `**${index+1}: ${playerEvents[index].event_id}**\r\n`
                            }
                        }
                        listEmbed.setFooter({ text: `Showing page ${currentPage+1}/${maxPage+1}`})
                        listEmbed.setDescription(embedListDescription)

                        var nextButtonDisabled = true;
                        if (currentPage < maxPage) {
                            nextButtonDisabled = false;
                        }
                        var backButtonDisabled = true;
                        if (currentPage > 0) { 
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

            if (pageInput) {
                if ( (pageInput - 1) > maxPage ) {
                    return await interaction.editReply({ content: `The page **${pageInput}** is invalid.`, ephemeral: true })
                }
                currentPage = pageInput - 1
            }

            var embedListDescription = " "
            for (let index = (currentPage*indexPerPage); index <= ((currentPage+1)*indexPerPage) -1 ; index++) {
                if (!playerEvents[index]) {break;}
                embedListDescription += `**${index+1}: ${playerEvents[index].event_id}**\r\n`
            }
            listEmbed.setFooter({ text: `Showing page ${currentPage+1}/${maxPage+1}`})
            listEmbed.setDescription(embedListDescription)

            var nextButtonDisabled = true;
            if (currentPage < maxPage) {
                nextButtonDisabled = false;
            }
            var backButtonDisabled = true;
            if (currentPage > 0) { 
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

            return await interaction.editReply({ephemeral: true , components: [ButtonsRow] , embeds: [listEmbed]})
        }
    }
}