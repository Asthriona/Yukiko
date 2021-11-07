/* eslint-disable no-unreachable */
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
	name: "mute",
	category: "Moderation",
	description: "Create a new role!",
	usage: "!mute <@mention> <time> <reason>",
	run: async (bot, message, args) => {
		// I need to fix that yeah... Eh I said I update the bot, not fixed all the shit. Re-reading this code is a pain...
		return message.reply("Command temporarly disabled.");
		const tomute = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!tomute) return message.reply("Erreur 10-Mun-f. Merci de spécifier un utilisateur.");
		if (message.member.hasPermission("KICK_MEMBERS")) {
			let muterole = message.guild.roles.cache.find("name", "muted");
			// Create muted role and overwrite permissions
			if (!muterole) {
				try {
					muterole = await message.guild.createRole({
						name: "muted",
						color: "#070505",
						permissions: [],
					});
					// eslint-disable-next-line no-unused-vars
					message.guild.channels.forEach(async (channel, id) => {
						await channel.overwritePermission(muterole, {
							SEND_MESSAGES: false,
							ADD_REACTIONS: false,
						});
					});
				}
				catch (e) {
					console.log(e.stack);
				}
			}

			const mutetime = args[1];
			if (!mutetime) return message.reply("Error: 10-MtU Merci de definire un temps de mute.");
			let muteReason = args.slice(2).join(" ");
			if (!muteReason) muteReason = "Parce que les admins sont méchant!";
			if(muteReason == "Raison Personel") return ("Error: 10-Ta pas mieux?");

			const iEmbed = new MessageEmbed()()
				.setAuthor("~Mute!~")
				.setThumbnail(tomute.user.displayAvatarURL())
				.setDescription(`**=> Muted user:** ${tomute} with ID ${tomute.id}
                **=> Muted by:** ${message.author} with ID: ${message.author.id}
                **=> Muted in:** ${message.channel} (${message.channel.id})
                **=> at:** ${message.createdAt}
                **=> Reason:** ${muteReason}
                **=> Time:** ${mutetime}`)
				.setColor("#800080")
				.setFooter(bot.user.username, bot.user.displayAvatarURL())
				.setTimestamp();
			const incidentChannel = message.guild.channels.find("name", "incident");
			if (!incidentChannel) return message.channel.send("Oops Erreur 10-Kick :/ <@186195458182479874> ");
			incidentChannel.send(iEmbed);

			await (tomute.addRole(muterole.id));
			message.reply(`<@${tomute.id}> à etait muter pendent ${mutetime} pour ${muteReason}`);
			setTimeout(function() {
				tomute.removeRole(muterole.id);
				message.channel.send(`<@${tomute.id}> a etait démute.`);
			}, ms(mutetime));
		}
		else { return message.reply("Oy!  qui t'as dit que tu pouvais mute les gens toi?! D:<"); }
	},
};