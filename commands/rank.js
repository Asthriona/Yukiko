var discord = require("discord.js");
var mongoose = require("mongoose");
var Canvas = require('canvas');
var botConfig = require('../botconfig.json');

let dbusername = botConfig.dbuser;
let dbpasswd = botConfig.dbpass;
mongoose.connect('mongodb+srv://' + dbusername + ':'+ dbpasswd +'@yukiko-pcvs8.mongodb.net/discordbot?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Users = require('../model/xp.js')

module.exports.run = async (bot, message, args) => {
//    Users.findOne({
//        did: message.author
//    }, (err, users) =>{
//        if(err) console.log(err);
//        var avatar = async function avatar(){
//            await Canvas.loadImage(message.author.displayAvatarURL);
//        }
//        var background = async function background(){
//            await Canvas.loadImage('https://cdn.asthriona.com/discordbotCard.jpg');
//        }
//        
//        var canvas = Canvas.createCanvas(934, 282);
//        var ctx = canvas.getContext('2d');
//        background
//        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
//        ctx.beginPath();
//        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
//        ctx.fillRect(260, 80, 650, 130);
//        ctx.stroke();
//        //show Username
//        ctx.font = '60px sans-serif';
//        ctx.fillStyle = '#fff';
//        ctx.fillText(message.author.username, 280, 141);
//        //Show Avatar
//        avatar
//        ctx.beginPath();
//        ctx.arc(140, 128, 110, 0, Math.PI * 2);
//        ctx.closePath();
//        ctx.clip();
//        ctx.drawImage(avatar, 25, 15, 256, 256);
//        //Show Level & XP
//        ctx.font = '50px sans-serif';
//        ctx.fillStyle = '#fff';
//        ctx.fillText("You are level " + users.level +" - "+ users.xp + " XP", 280, 185);
//        var lvlimg = new discord.Attachment(canvas.toBuffer(), 'lvlup-image.png');
//        message.channel.send(lvlimg);
//        }

}       
module.exports.help = {
    name: "rank",
    description: "Show... bot uptime? more or less."
}
