const { SlashCommandBuilder } = require('discord.js')
const { History } = require('../models/history.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fetchevent')
        .setDescription('fetch an existing event')
        .addStringOption(option =>
            option.setName('id')
            .setDescription('the id of the event to fetch')
            .setRequired(true)),
    async execute(interaction){
        const section_id = interaction.options.getString('section-id')

        const history = await History.findOne({ where: { section_id: section_id } })

        if (history) {
            return interaction.reply(`${history.get('name')}'s event ${history.get('when')}: ${history.get('whp')}`)
        }

        return interaction.reply(`Can't find event with id ${section_id}`)
    }
}