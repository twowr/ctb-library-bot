const { ActionRowBuilder, ButtonBuilder, ButtonStyle , SelectMenuBuilder, ComponentType , SlashCommandBuilder } = require('discord.js');
/** Hey 2wr, made this script to give you a base for the futures commands.
 * 	There currently a problem with the collector, we cannot set two of them at the same time since both of them will fire, we would need a way to differance them.
 *  Another alternative would be to use "on interactionCreate" but that would probably inclue modifing the event interactionCreate.js to make the handler handling those too.
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName('testinteraction')
		.setDescription('reply with a test interaction'),
	async execute(interaction) {

		const ButtonsRow = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('primary')
				.setLabel('Button Primary')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('success')
				.setLabel('Button Success')
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId('danger')
				.setLabel('Button Danger')
				.setStyle(ButtonStyle.Danger),
			new ButtonBuilder()
				.setCustomId('secondary')
				.setLabel('Button Secondary')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setLabel('Button Link')
				.setStyle(ButtonStyle.Link)
				.setURL("https://youtu.be/iik25wqIuFo"),
		);

		const SelectMenuRow = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Please select one of the following option.')
					.addOptions(
						{
							label: 'osu',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'osu!lazer',
							description: 'This is also a description',
							value: 'second_option',
						},
					),
			);

		// Based on https://discordjs.guide/popular-topics/collectors.html#interaction-collectors
		const collectorButton = interaction.channel.createMessageComponentCollector({ComponentType: ComponentType.Button ,time: 25000 }); 
		//const collectorSelectMenu = interaction.channel.createMessageComponentCollector({ComponentType: ComponentType.SelectMenu ,time: 25000 });

		collectorButton.on('collect', async i => {
			console.warn("button");
			
			if (i.user.id === interaction.user.id) {
				await i.deferUpdate();
				await new Promise(resolve => setTimeout(resolve, 4000));; // Simulate a long background task
				i.editReply({ content: `<@${i.user.id}> clicked on the button ID <${i.customId}>`, ephemeral: true });
            } else {
                i.reply({ content: `You are not allowed to interact with this!`, ephemeral: true });
            }
		});

	/*	collectorSelectMenu.on('collect', async i => {
			console.warn("menu");
			if (i.user.id === interaction.user.id) {
				await i.deferUpdate();
				await new Promise(resolve => setTimeout(resolve, 4000));; // Simulate a long background task
				i.editReply({ content: `<@${i.user.id}> clicked on the option with the value <${i.values[0]}>`, ephemeral: true });
            } else {
                i.reply({ content: `You are not allowed to interact with this!`, ephemeral: true });
            }
		});
	*/

		await interaction.reply({ content: 'Here are the components!', components: [ButtonsRow,SelectMenuRow] });
	},
};
