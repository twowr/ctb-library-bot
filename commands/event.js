const { ActionRowBuilder, SlashCommandBuilder, TextInputStyle, ModalBuilder, TextInputBuilder } = require('discord.js')
const { Player, PlayerEvent } = require('../database.js')

module.exports = {
	data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Manage the event history')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                    .setDescription('Add a new event')
                    .addStringOption(option =>
                        option.setName('player')
                            .setDescription('Who is this event from')
                            .setRequired(true))
                    .addStringOption(option =>
                        option.setName('date')
                            .setDescription('Format: YYYY-MM-DD')
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
            const dateInput = interaction.options.getString('date')
            const titleInput = interaction.options.getString('title')
            const bodyInput = interaction.options.getString('body')
            const playerNameInput = interaction.options.getString('player')

            const playerData = await Player.findOne({ where: { name: playerNameInput } })

            if (!playerData) {
                return interaction.reply({ content: `**${playerNameInput}** wasn't found inside the player list.`, ephemeral: true })
            }

            const result = await PlayerEvent.create({
                date: dateInput,
                title: titleInput,
                body: bodyInput
            })

            await result.setPlayer(playerData)

            return interaction.reply({ content: `Your event have successfully been assigned to **${playerNameInput}** as Event ID **${result.event_id}**!`, ephemeral: true })
        }
        
        if (interaction.options.getSubcommand() === 'remove') {
            const eventIDInput = interaction.options.getString('eventid')
            const playerEvent = await PlayerEvent.findByPk(eventIDInput)
            if (!playerEvent)
            {
                return interaction.reply({ content: `The event ID **${eventIDInput}** is invalid.`, ephemeral: true })
            }
            await playerEvent.destroy()
            return interaction.reply({ content: `The event ID **${eventIDInput}** have successfully been removed!`, ephemeral: true })
        }

        if (interaction.options.getSubcommand() === 'edit') {
            const eventIDInput = interaction.options.getString('eventid')
            const playerEvent = await PlayerEvent.findByPk(eventIDInput)
            const currentPlayerData = await playerEvent.getPlayer()
            if (!playerEvent)
            {
                return interaction.reply({ content: `The event ID **${eventIDInput}** is invalid.`, ephemeral: true })
            }

            const modal = new ModalBuilder()
                .setCustomId('editModel')
                .setTitle(`Update history ID : ${eventIDInput}`);

            const playerInputActionRow = new ActionRowBuilder().addComponents(new TextInputBuilder()
                .setCustomId('playerInput')
                .setLabel("What is the player name of the history?")
                .setValue(currentPlayerData.name)
                .setMaxLength(40)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
            );

            const dateInputActionRow = new ActionRowBuilder().addComponents(new TextInputBuilder()
                .setCustomId('dateInput')
                .setLabel("What is the date of the history?")
                .setValue(playerEvent.date)
                .setMinLength(10)
                .setMaxLength(11) // If this bot is still alive in the year 100000 this gonna be a miracle.
                .setRequired(true)
                .setPlaceholder("Format : YYYY-MM-DD. Ex : 2022-04-18")
                .setStyle(TextInputStyle.Short)
            );

            const titleInputActionRow = new ActionRowBuilder().addComponents(new TextInputBuilder()
                .setCustomId('titleInput')
                .setLabel("What is the title of the history?")
                .setValue(playerEvent.title)
                .setMaxLength(150)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
            );

            const bodyInputActionRow = new ActionRowBuilder().addComponents(new TextInputBuilder()
                .setCustomId('bodyInput')
                .setLabel("Insert the story here!")
                .setValue(playerEvent.body) 
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

                    const playerNameInput = submitted.fields.getField("playerInput").value
                    const dateInput = submitted.fields.getField("dateInput").value
                    const titleInput = submitted.fields.getField("titleInput").value
                    const bodyInput = submitted.fields.getField("bodyInput").value

                    const playerData = Player.findOne({ where: { name: playerNameInput } })

                    if (!playerData) {
                        return interaction.reply({ content: `**${playerNameInput}** wasn't found inside the player list.`, ephemeral: true })
                    }
                    
                    try {
                        const result = await playerEvent.update({ date: dateInput, title: titleInput, body: bodyInput}, { where: { event_id: eventIDInput } })
                        await result.setPlayer(playerData)
                    }
                    catch(err) {
                        console.error(err)
                        return submitted.reply({content: `Something went wrong when the bot was trying to update the event ID **${eventIDInput}**.`, ephemeral: true })
                    }
                    await submitted.reply({content: `The event ID **${eventIDInput}** have been updated.`, ephemeral: true })
                }
        }
    }
}