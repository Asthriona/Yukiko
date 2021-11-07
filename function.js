module.exports = {
	getMember: function(message, toFind = "") {
		toFind = toFind.toLowerCase();
		let target = message.guild.members.cache.get(toFind);
		if (!target && message.mentions.members) {target = message.mentions.members.first();}
		if (!target && toFind) {
			target = message.guild.members.find(member => {
				return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind);
			});
		}
		if (!target) {target = message.member;}

		return target;
	},
	formatDate: function(date) {
		return new Intl.DateTimeFormat("en-US").format(date);
	},
	promptMessage: async function(message, author, time, validReactions) {
		time *= 1000;
		for(const reaction of validReactions) await message.react(reaction);
		const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
		return message
			.awaitReactions(filter, { max: 1, time: time })
			.then(collected => collected.first() && collected.first().emoji.name);
	},
};