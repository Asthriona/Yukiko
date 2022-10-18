module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction, bot) {
		console.log(interaction);
		// check if command.
		if(!interaction.isChatInputCommand()) return;
		// check if command is run in DMs.
		if(interaction.commandGuildId === null || interaction.channel.type === "DM") return;

		// Build Data for command.
		const cmd = interaction.commandName;
		const Slashes = bot.slash.get(cmd);
		if(!Slashes) return;
		// Executhe command.
		Slashes.execute(interaction, bot);
	},
};
