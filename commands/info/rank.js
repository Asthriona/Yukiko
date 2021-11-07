const discord = require("discord.js");
const mongoose = require("mongoose");
const Canvas = require("canvas");

const botConfig = require("../../botconfig.json");
const { getMember } = require("../../function");

mongoose.connect(botConfig.dbLink, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const Users = require("../../model/xp.js");
const Cards = require("../../model/card.js");

module.exports = {
	name: "rank",
	aliases: ["level", "card"],
	description: "Show you your XP Card.",
	category: "info",
	usage: "[username | id | mention]",
	run: async (bot, message, args) => {
		const canvas = Canvas.createCanvas(934, 282);
		const ctx = canvas.getContext("2d");
		// Get Background Image
		Cards.findOne({
			did: message.author.id,
		}, (err, cards) => {
			if (err) {
				console.log(err);
				return message.reply("An error happened. ```" + err + "```");
			}
			const cardBg = cards.link;
			Users.findOne({
				did: message.author.id,
				serverID: message.guild.id,
			}, async (err, users) => {
				if (err) {
					console.log(err);
					return message.reply("An error happened. ```" + err + "```");
				}
				const member = getMember(message, args.join(" "));
				const background = await Canvas.loadImage(cardBg);
				ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
				// Draw rectangle
				ctx.beginPath();
				ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
				ctx.fillRect(260, 80, 650, 160);
				ctx.closePath();
				ctx.stroke();
				// Get Username
				ctx.font = "60px sans-serif";
				ctx.fillStyle = "#fff";
				ctx.fillText(member.displayName, 280, 136);
				// Show XP and levels
				const nxtlvl = 300 * Math.pow(2, users.level);
				ctx.font = "40px sans-serif";
				ctx.fillStyle = "#fff";
				ctx.fillText("You are level " + users.level + " - " + users.xp + " XP", 280, 180);
				// xp left
				const xpLeft = nxtlvl - users.xp;
				ctx.font = "50px sans-serif";
				ctx.fillStyle = "#fff";
				ctx.fillText(`next level in ${xpLeft} XP`, 280, 225);
				// Get avatar
				console.log("pog");
				await GetAvatar(message, ctx);
				// Put all the things together and send it in a nice package.
				const lvlimg = new discord.MessageAttachment(canvas.toBuffer(), "rank-cards.png");
				message.reply({ files: [lvlimg] });
			});
		});
	},
};

async function GetAvatar(message, ctx) {
	// I HATE this part. I think here at the Yukiko Dev Team Incorporation ltd llc Group we all hate this part.
	// If Anyone know how to use canvas and this part better than us, please feel free to PR :)
	// (or if you are a dev of node-canvas please contact me on Twitter/Github @Asthriona )

	// EDIT: We did it better on Yukiko :) (https://Yukiko.app) - Asthriona.
	// EDIT2: I should seriously update that ahah!

	// Avatar function
	// get user in the database.
	Users.findOne({
		did: message.author.id,
	}, async (err, users)=>{
		// XP bar calculus. (Help)
		const nxtlvl = 300 * Math.pow(2, users.level);
		const n = ((users.xp - nxtlvl) / nxtlvl) * -100;
		const member = getMember(message);
		const arc = (100 - n) / 100 * Math.PI;
		// Image arc draw (Cry in js)
		ctx.strokeStyle = member.displayHexColor;
		ctx.beginPath();
		ctx.lineWidth = 15;
		ctx.arc(125, 140, 102, Math.PI * 1.5, arc);
		ctx.stroke();
	});
	// lvlbar background
	ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
	ctx.beginPath();
	ctx.lineWidth = 20;
	ctx.arc(125, 140, 102, 0, Math.PI * 2);
	ctx.stroke();
	// Print the profile picture.
	const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: "jpg" }));
	ctx.beginPath();
	ctx.arc(125, 140, 100, 0, Math.PI * 2);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(avatar, 25, 40, 200, 200);
}
