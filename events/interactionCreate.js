module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction, bot) {
		// check if command.
		if(!interaction.isCommand()) return;
		// check if command is run in DMs.
		if(interaction.guildId === null || bot.user.id) return;

		const cmd = interaction.commandName;
		const Slashes = bot.slash.get(cmd);
		if(!Slashes) return;
		Slashes.run(interaction, bot);
	},
};
