const { ActionRowBuilder, SelectMenuBuilder, ComponentType, SlashCommandBuilder } = require('discord.js')
const { History } = require('../models/history.js')

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
            const playername = interaction.options.getString('playername')
            const date = interaction.options.getString('date')
            const title = interaction.options.getString('title')
            const body = interaction.options.getString('body')

            const event = await History.create({ 
                playername: playername,
                date: date,
                title: title,
                body: body
            })

            return interaction.reply({ content: `Event added!`, ephemeral: true })
        }
        
        if (interaction.options.getSubcommand() === 'remove') {
            const id = interaction.options.getString('id')
            const history = await History.findByPk(id)
            await history.destroy()
            return interaction.reply({ content: `Event removed!`, ephemeral: true })
        }

        if (interaction.options.getSubcommand() === 'edit') {
            const id = interaction.options.getString('id')
            const history = await History.findByPk(id)

            const SelectMenuRow = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('select')
                            .setPlaceholder('can select multiple')
                            .setMinValues(1)
                            .setMaxValues(4)
                            .addOptions(
                                {
                                    label: 'player',
                                    description: 'edit who this event belong to',
                                    value: 'playername',
                                },
                                {
                                    label: 'date',
                                    description: 'edit the date of the event',
                                    value: 'date',
                                },
                                {
                                    label: 'title',
                                    description: 'edit the title of the event',
                                    value: 'title',
                                },
                                {
                                    label: 'body',
                                    description: 'edit the body of the event',
                                    value: 'body',
                                }
                            ),
                    )

            const collectorSelectMenu = interaction.channel.createMessageComponentCollector({ComponentType: ComponentType.SelectMenu ,time: 25000 })

            collectorSelectMenu.on('collect', async i => {
                console.warn("menu")
                if (i.user.id === interaction.user.id) {
                    await i.deferUpdate()
                    await new Promise(resolve => setTimeout(resolve, 4000))

                    i.editReply({ content: `<@${i.user.id}> clicked on the option with the value <${i.values.join(', ')}>`, ephemeral: true })
                } else {
                    i.reply({ content: `You are not allowed to interact with this!`, ephemeral: true })
                }
            })

            return interaction.reply({ content: 'Select what you want to edit', components: [SelectMenuRow], ephemeral: true })
        }
    }
}