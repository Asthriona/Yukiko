/* eslint-disable no-useless-escape */
module.exports = {
	name: "ping",
	category: "info",
	description: "return bot latency and API ping.",
	run: async (bot, message) => {
		const spells = [
			"Agi", "Maragi", "Agilao", "Maragion",
			"Agidyne", "Maragidyne",
		];
		const shadows = [
			"Lying Hablerie", "Calm Pesce", "Trance Twins", "Black Raven",
			"Magic Hand", "Secret Bambino", "Positive King", "Brinze Dice",
			"Burning Beetle", "Phantom Mage", "Heat Balance", "Laughing Table",
			"Avenger knight",
		];
		const randomSpell = spells[Math.floor(Math.random() * spells.length)];
		const randomShadow = shadows[Math.floor(Math.random() * shadows.length)];
		const msg = await message.reply(`\* Yukiko cast ${randomSpell} against ${randomShadow} \*`);
		msg.edit(`**Pong!** \n Gateway latency: ${Math.floor(msg.createdAt - message.createdAt)}ms. \n API latency: ${Math.round(bot.ws.ping)}ms.`);
	},
};