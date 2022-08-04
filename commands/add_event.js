const { SlashCommandBuilder } = require('discord.js');
/**  Instead of making an addEvent, removeEvent and editEvent command we could make an event command that uses 3 subcommands for add, remove, and edit 
 * Exemple : (with only one subcommand)
 * 
 * new SlashCommandBuilder()
		.setName('event')
		.setDescription('Manage the player wiki')
        .addSubcommand(subcommand =>
        subcommand
            .setName("add")
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
                    .setRequired(true)),
            )
        ),
 * Then whe could know what subcommand was used by doing   interaction.options.getSubcommand()
 *  - Med367367 (Don't forgot the remove this comment at the end)
 * */ 
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addevent')
		.setDescription('Add a new event')
        .addStringOption(option =>
            option.setName('playername')
                .setDescription('From which player is this event from?')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('when')
                .setDescription('format:YYYY-MM-DD')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('whathappened') // If whathappened is mean to be used as a title, why not naming it Title?
                .setDescription('Basically a title, make it short')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('witi')
                .setDescription('Why is that important')
                .setRequired(true)),
	async execute(interaction) {
		await interaction.reply(`added a new event for ${interaction.options.getString('playername')} on ${interaction.options.getString('when')} with ${interaction.options.getString('whathappened')} and ${interaction.options.getString('witi')}`);
	},
};