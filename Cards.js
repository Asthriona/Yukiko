const { MessageAttachment } = require('discord.js')
var {getMember} = require("./function");
var Canvas = require('canvas');
const Cards = require('./model/card')

module.exports = {
    //Level up image
    async lvlupimg(message, users) {
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
        Cards.findOne({
            did: message.author.id
        }, async (err, cards)=>{
            var cardbg = cards.link
        var member = getMember(message);
        var background = await Canvas.loadImage(cardbg);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        //Draw rectangle
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(260, 80, 650, 160);
        ctx.closePath();
        ctx.stroke();
        //show Username
        ctx.font = applyText(canvas, member.displayName);
        ctx.fillStyle = '#fff';
        ctx.fillText(member.displayName + " Level up!", 280, 136);
        //Show Level & XP
        let nxtlvl = 300 * Math.pow(2, users.level);
        var xpleft = nxtlvl - users.xp;
        ctx.font = '40px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText("You are level now " + users.level + " - " + users.xp + " XP", 280, 180);
        //xp Left
        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText("Next Level in " + xpleft + " xp", 280, 225);
        //Get avatar
        var avatar = await Canvas.loadImage(message.author.displayAvatarURL({format: "jpg"}));
    ctx.beginPath();
    ctx.arc(125, 140, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 40, 200, 200);
        //put image together and send it
        var lvlupimg = new MessageAttachment(canvas.toBuffer(), 'lvlup-image.png')
        message.channel.send(lvlupimg);
    })
    },

    // Welcome Cards
    async WelcomeCad(member, channel) {
        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');
            let fontSize = 70;
            do {
                ctx.font = `${fontSize -= 10}px sans-serif`;
            } while (ctx.measureText(text).width > canvas.width - 300);
            return ctx.font;
        };
    Cards.findOne({
        did: member.user.id
    }, async (err, cards)=>{
        var canvas = Canvas.createCanvas(934, 282);
        var ctx = canvas.getContext('2d');
        var cardbg = cards.link
        var background = await Canvas.loadImage(cardbg);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(260, 80, 650, 130);
        ctx.stroke();
        //get username 
        ctx.font = applyText(canvas, member.user.username);
        ctx.fillStyle = '#fff';
        ctx.fillText(member.user.username, 280, 141);
        //Get guild name
        ctx.font = applyText(canvas, member.guild.name);
        ctx.fillStyle = '#fff';
        ctx.fillText("Joined the server! ", 280, 195);
        //Get avatar
        var avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: "jpg"}));
        ctx.beginPath();
        ctx.arc(140, 128, 110, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 25, 15, 256, 256);
        var attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
        channel.send(`Welcome ${member.user}`, attachment)
    });
    },
    // Farewell Cards
    async farewell(member, channel) {
        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');
            let fontSize = 70;
            do {
                ctx.font = `${fontSize -= 10}px sans-serif`;
            } while (ctx.measureText(text).width > canvas.width - 300);
            return ctx.font;
        };
        Cards.findOne({
            did: member.user.id
        }, async (err, cards) =>{
        var cardbg = cards.link
        var background = await Canvas.loadImage(cardbg);
        var canvas = Canvas.createCanvas(934, 282);
        var ctx = canvas.getContext('2d');
        var cardsbg = cards.link
        var background = await Canvas.loadImage(cardsbg);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(260, 80, 650, 130);
        ctx.stroke();
        //get username 
        ctx.font = applyText(canvas, member.user.username);
        ctx.fillStyle = '#fff';
        ctx.fillText(member.user.username, 280, 141);
        //Get guild name
        ctx.font = applyText(canvas, member.guild.name);
        ctx.fillStyle = '#fff';
        ctx.fillText("Left the server! ", 280, 195);
        //Get avatar
        var avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: "jpg"}));
        ctx.beginPath();
        ctx.arc(140, 128, 110, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 25, 15, 256, 256);
        var attachment = new MessageAttachment(canvas.toBuffer(), 'farewell-image.png');
        channel.send(attachment)
    })
}
}