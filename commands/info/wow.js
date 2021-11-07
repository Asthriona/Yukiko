// Well... I got this commands working on another bot (private commission) but I think i never finished it here.
// Naw worries, its on my todo list :)
const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const botConfig = require("../../botconfig.json");

module.exports = {
	name: "wow",
	category: "info",
	description: "Return your World of warcraft character!",
	usage: "<Character Name | Realm Name | Region (EU, US)>",
	run: async (bot, message, args) => {
		const char = args[0];
		const realm = args[1];
		let region = args[2];
		if(!region) region = "eu";
		console.log(args[0] + " " + args[1]);
		axios.get("https://" + region + ".api.blizzard.com/wow/character/" + realm + "/" + char + "?locale=en_US&access_token=" + botConfig.wowAT).then(function(res) {

			if(message.author.id === "186195458182479874") {
				if(res.data.faction === 0) {
					const wowembed = new MessageEmbed()()
						.setTitle("Infos for: " + args)
						.addField("Name:", res.data.name, true)
						.addField("Realm", res.data.realm, true)
						.addField("Battlegroup", res.data.battlegroup, true)
						.addField("Class:", res.data.class, true)
						.addField("Race", res.data.race, true)
						.addField("Gender", res.data.gender, true)
						.addField("level", res.data.level, true)
						.addField("Achievement Points", res.data.achievementPoints, true)
						.addField("Calc Class", res.data.calcClass, true)
						.addField("faction", "Alliance", true)
						.addField("Total Honorable Kills", res.data.totalHonorableKills, true)
						.addField("ID", res.data.id, true);
					message.channel.send(wowembed);
				}
				else{
					const wowembed = new MessageEmbed()()
						.setTitle("Infos for: " + args)
						.addField("Name:", res.data.name, true)
						.addField("Realm", res.data.realm, true)
						.addField("Battlegroup", res.data.battlegroup, true)
						.addField("Class:", res.data.class, true)
						.addField("Race", res.data.race, true)
						.addField("Gender", res.data.gender, true)
						.addField("level", res.data.level, true)
						.addField("Achievement Points", res.data.achievementPoints, true)
						.addField("Calc Class", res.data.calcClass, true)
						.addField("faction", "Horde", true)
						.addField("Total Honorable Kills", res.data.totalHonorableKills, true)
						.addField("ID", res.data.id, true);
					message.channel.send(wowembed);
				}
			}
		}).catch(err => message.channel.send("WAW! an error sucessfully happened! ```" + err + "```"));
	},
};