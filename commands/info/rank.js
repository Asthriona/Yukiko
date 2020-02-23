var discord = require("discord.js");
var mongoose = require("mongoose");
var Canvas = require('canvas');
var botConfig = require('../../botconfig.json');

mongoose.connect(botConfig.dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Users = require('../../model/xp.js')

module.exports = {
    name: "rank",
    aliases: ["level", "card"],
    description: "SHow you your XP Card.",
    category: "info",
    usage: "[username | id | mention]",
    run: async (bot, message, args) => {
        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');
            let fontSize = 70;
            do {
                ctx.font = `${fontSize -= 10}px sans-serif`;
            } while (ctx.measureText(text).width > canvas.width - 300);
            return ctx.font;
        };
    
        var canvas = Canvas.createCanvas(934, 282);
        var ctx = canvas.getContext('2d');
        //Get Background Image
        if (message.author.id == 186195458182479874) {
            var background = await Canvas.loadImage('https://cdn.asthriona.com/fdklgjdlfkjg.jpg');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(260, 80, 650, 160);
            ctx.closePath();
            ctx.stroke();
            //show Username
            ctx.font = applyText(canvas, message.author.username);
            ctx.fillStyle = '#fff';
            ctx.fillText(message.author.username, 280, 136);
            //Get Database infos
            Users.findOne({
                did: message.author.id,
                serverID: message.guild.id
            }, async (err, users) => {
                if (err) console.log(err);
                //Show Level & XP
                let nxtlvl = 300 * Math.pow(2, users.level)
                var xpleft = nxtlvl - users.xp;
                ctx.font = '40px sans-serif';
                ctx.fillStyle = '#fff';
                ctx.fillText("You are level " + users.level + " - " + users.xp + " XP", 280, 180);
                //xp Left
                ctx.font = '50px sans-serif';
                ctx.fillStyle = '#fff';
                ctx.fillText("Next Level in " + xpleft + " xp", 280, 225);
                //Get avatar
                await GetAvatar(message, ctx);
                //Put the image together and send it
                var lvlimg = new discord.Attachment(canvas.toBuffer(), 'lvlup-image.png');
                message.channel.send(lvlimg);
            });
        } else {
            //get background
            var background = await Canvas.loadImage('https://cdn.asthriona.com/DefaultYukikocard.jpg');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            //Draw rectangle
            ctx.beginPath();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(260, 80, 650, 160);
            ctx.closePath();
            ctx.stroke();
            //show Username
            ctx.font = '60px sans-serif';
            ctx.fillStyle = '#fff';
            ctx.fillText(message.author.username, 280, 136);
            //Search in database
            Users.findOne({
                did: message.author.id,
                serverID: message.guild.id
            }, async (err, users) => {
                if (err) console.log(err);
                //Show Level & XP
                let nxtlvl = 300 * Math.pow(2, users.level)
                var xpleft = nxtlvl - users.xp;
                ctx.font = '40px sans-serif';
                ctx.fillStyle = '#fff';
                ctx.fillText("You are level " + users.level + " - " + users.xp + " XP", 280, 180);
                //xp Left
                ctx.font = '50px sans-serif';
                ctx.fillStyle = '#fff';
                ctx.fillText("Next Level in " + xpleft + " xp", 280, 225);
                //Get avatar
                await GetAvatar(message, ctx);
                //put image together and send it
                var lvlimg = new discord.Attachment(canvas.toBuffer(), 'lvlup-image.png');
                message.channel.send(lvlimg);
            });
        }
    }
}
async function GetAvatar(message, ctx) {
    var avatar = await Canvas.loadImage(message.author.displayAvatarURL);
    ctx.beginPath();
    ctx.arc(125, 140, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 40, 200, 200);
}