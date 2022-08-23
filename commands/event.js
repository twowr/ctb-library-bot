const { ActionRowBuilder, SlashCommandBuilder, TextInputStyle, ModalBuilder, TextInputBuilder } = require('discord.js')
const { Player } = require('../models/player.js')
const { PlayerEvent } = require('../models/playerEvent.js')

module.exports = {
	data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Manage the event history')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                    .setDescription('Add a new event')
                    .addStringOption(option =>
                        option.setName('player')
                            .setDescription('who is this event from')
                            .setRequired(true))
                    .addStringOption(option =>
                        option.setName('date')
                            .setDescription('format: YYYY-MM-DD')
                            .setRequired(true))
                    .addStringOption(option =>
                        option.setName('title')
                            .setDescription('The title of the event')
                            .setRequired(true))
                    .addStringOption(option =>
                        option.setName('body')
                            .setDescription('The body of the event')
                            .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                    .setDescription('Remove an event')
                    .addStringOption(option =>
                        option.setName('eventid')
                            .setDescription('The id of the event you want to remove')
                            .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('edit')
                    .setDescription('Edit an event')
                    .addStringOption(option =>
                        option.setName('eventid')
                            .setDescription('The id of the event you want to edit')
                            .setRequired(true))),
	async execute(interaction) {
        if (interaction.options.getSubcommand() === 'add') {
            const player = await Player.findOne({ where: { name: interaction.options.getString('player') } })

            if (player === null) {
                return interaction.reply({ content: 'Player not found', ephemeral: true })
            }

            const date = interaction.options.getString('date')
            const title = interaction.options.getString('title')
            const body = interaction.options.getString('body')

            const event = await PlayerEvent.create({
                date: date,
                title: title,
                body: body
            })

            await event.setPlayer(player)

            return interaction.reply({ content: `Event added!`, ephemeral: true })
        }
        
        if (interaction.options.getSubcommand() === 'remove') {
            const id = interaction.options.getString('eventid')
            const playerEvent = await PlayerEvent.findByPk(id).destroy()
            return interaction.reply({ content: `Event removed!`, ephemeral: true })
        }

        if (interaction.options.getSubcommand() === 'edit') {
            const id = interaction.options.getString('eventid')
            // hey so basically here, something wrong, can't manage to undestand your database system or find answer working online so im gonna put comment where we should load them.
            const playerEvent = await PlayerEvent.findOne({ where: { event_id: id }, include: 'player' })
            if (playerEvent) // Change that to check if history exist or not
            {
                const modal = new ModalBuilder()
                    .setCustomId('editModel')
                    .setTitle(`Update history ID : ${id}`);
                
                const playerInputActionRow = new ActionRowBuilder().addComponents(new TextInputBuilder()
                    .setCustomId('playerInput')
                    .setLabel("What is the player name of the history?")
                    .setValue(playerEvent.player.name) // DATABASE CURRENT PLAYER NAME
                    .setMaxLength(40)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                );

                const dateInputActionRow = new ActionRowBuilder().addComponents(new TextInputBuilder()
                    .setCustomId('dateInput')
                    .setLabel("What is the date of the history?")
                    .setValue(playerEvent.date) // DATABASE CURRENT DATE
                    .setMinLength(10)
                    .setMaxLength(11) // If this bot is still alive in the year 100000 this gonna be a miracle.
                    .setRequired(true)
                    .setPlaceholder("Format : YYYY-MM-DD. Ex : 2022-04-18")
                    .setStyle(TextInputStyle.Short)
                );

                const titleInputActionRow = new ActionRowBuilder().addComponents(new TextInputBuilder()
                    .setCustomId('titleInput')
                    .setLabel("What is the title of the history?")
                    .setValue(playerEvent.title) // DATABASE CURRENT TITLE
                    .setMaxLength(150)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                );

                const bodyInputActionRow = new ActionRowBuilder().addComponents(new TextInputBuilder()
                    .setCustomId('bodyInput')
                    .setLabel("Insert the story here!")
                    .setValue(playerEvent.body) // DATABASE CURRENT BODY
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)
                );

                    modal.addComponents(playerInputActionRow, dateInputActionRow,titleInputActionRow,bodyInputActionRow);
                    await interaction.showModal(modal)
                    
                    // Get the Modal Submit Interaction that is emitted once the User submits the Modal
                    const submitted = await interaction.awaitModalSubmit({ time: 600000 , filter: i => i.user.id === interaction.user.id }).catch(error => {
                        console.error(error)
                        return null
                    })
                    
                    // We can use the https://discord.js.org/#/docs/discord.js/stable/class/ModalSubmitFieldsResolver to get the value of an input field from the Custom ID
                    if (submitted) {
                        const player = await Player.findOne({ where: { name: submitted.getString('playerInput') } })
                        const date = submitted.fields.getField("dateInput").value
                        const title = submitted.fields.getField("titleInput").value
                        const body = submitted.fields.getField("bodyInput").value
                        await submitted.reply({content: `<@${submitted.user.id}> submitted the form to update values in the database! The player name is **${player.name}**. The date is **${date}**. The title is **${title}**. Here is the story **${body}**` })

                        if (update === null) {
                            return interaction.reply({ content: 'Player not found', ephemeral: true })
                        }
                        
                        const update = await playerEvent.update({ date: date, title: title, body: body })
                        update.setPlayer(player)

                        return interaction.followUp({ content: `Event updated!`, ephemeral: true })
                    }

            } else {
                return interaction.reply({ content: `The event ID : ${id} is invalid.`, ephemeral: true })
            }
        }
    }
}