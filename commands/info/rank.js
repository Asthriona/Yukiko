var discord = require("discord.js");
var mongoose = require("mongoose");
var Canvas = require('canvas');

var botConfig = require('../../botconfig.json');
var {getMember} = require("../../function")

mongoose.connect(botConfig.dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Users = require('../../model/xp.js')
var Cards = require('../../model/card.js')

module.exports = {
    name: "rank",
    aliases: ["level", "card"],
    description: "Show you your XP Card.",
    category: "info",
    usage: "[username | id | mention]",
    run: async (bot, message, args) => {
        var canvas = Canvas.createCanvas(934, 282);
        var ctx = canvas.getContext('2d');
        //Get Background Image
        Cards.findOne({
            did: message.author.id
        }, (err, cards) => {
            if (err) {
                console.log(err)
                return message.reply("An error happened. ```" + err + "```")
            }
            var cardBg = cards.link
            Users.findOne({
                did: message.author.id,
                serverID: message.guild.id
            }, async (err, users) => {
                if (err) {
                    console.log(err)
                    return message.reply("An error happened. ```" + err + "```")
                }
                var member = getMember(message, args.join(" "));
                var background = await Canvas.loadImage(cardBg);
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                //Draw rectangle
                ctx.beginPath();
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(260, 80, 650, 160);
                ctx.closePath();
                ctx.stroke();
                //Get Username
                ctx.font = '60px sans-serif';
                ctx.fillStyle = '#fff';
                ctx.fillText(member.displayName, 280, 136);
                //Show XP and levels
                let nxtlvl = 300 * Math.pow(2, users.level);
                ctx.font = '40px sans-serif';
                ctx.fillStyle = '#fff';
                ctx.fillText("You are level " + users.level + " - " + users.xp + " XP", 280, 180);
                //xp left
                var xpLeft = nxtlvl - users.xp;
                ctx.font = '50px sans-serif';
                ctx.fillStyle = '#fff';
                ctx.fillText(`next level in ${xpLeft} XP`, 280, 225);
                //Get avatar
                await GetAvatar(message, ctx);
                //Put all the things together and send it in a nice package.
                var lvlimg = new discord.Attachment(canvas.toBuffer(), 'rank-cards.png');
                message.reply(lvlimg)
            });
        })
    }
}

async function GetAvatar(message, ctx) {
    Users.findOne({
        did: message.author.id
    }, async (err, users)=>{
        //calculus
        let nxtlvl = 300 * Math.pow(2, users.level);
        var n = ((users.xp - nxtlvl) / nxtlvl) * -100;
        var member = getMember(message);
        var arc = (100-n)/100*Math.PI;
        //Image arc draw
        ctx.strokeStyle = member.displayHexColor;
        ctx.beginPath();
        ctx.lineWidth = 15;
        ctx.arc(125, 140, 102, Math.PI*1.5,arc);
        ctx.stroke();
    })
    //lvlbar background
            ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
            ctx.beginPath();
            ctx.lineWidth = 20;
            ctx.arc(125, 140, 102, 0,Math.PI * 2);
            ctx.stroke();
    //pfp
    var avatar = await Canvas.loadImage(message.author.displayAvatarURL);
    ctx.beginPath();
    ctx.arc(125, 140, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 40, 200, 200);
}
