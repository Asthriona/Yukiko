// remember to make a command for the welcome channel as this bot is not set to run with a website.
const { WelcomeCad } = require("../Cards");
module.exports = {
	name: "guildMemberAdd",
	once: false,
	async execute(member) {
		const welcomeChannel = member.guild.channels.find(channel => channel.name === "welcome");
		if (!welcomeChannel) return;
		return await WelcomeCad(member, welcomeChannel);
	},
};