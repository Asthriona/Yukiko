// Geez. I had no idea how time works.
// Message to Future Asthriona. use Day.js or moment for that pls.
module.exports = {
	name: "uptime",
	category: "info",
	description: "Show bot's uptime",
	run: async (bot, message) => {
		let totalSeconds = (bot.uptime / 1000);
		const days = Math.floor(totalSeconds / 86400);
		const hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = Math.floor(totalSeconds / 60);
		const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
		message.channel.send(uptime);
	},
};