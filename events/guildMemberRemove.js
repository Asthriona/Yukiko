const { farewell } = require("../Cards");
module.exports = {
	name: "guildMemberRemove",
	once: false,
	async execute(member) {
		const farewellChannel = member.guild.channels.find(channel => channel.name === "welcome");
		if (!farewellChannel) return;
		return await farewell(member, farewellChannel);
	},
};