module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return

        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) return

        try {
            await command.execute(interaction)
        } catch (error) {
            console.error(error)
            if (interaction.deferred) // just handling deferred commands to prevent errors
            {
                return await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: interaction.ephemeral })
            }

            if (interaction.isModalSubmit) 
            {
                // Discord UI Gonna throw a error on the user side, unable to respond since interaction is already in a responded state that cannot use editReply
                return null;
            }
            return await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        }
    }
}