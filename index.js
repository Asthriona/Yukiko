var botConfig = require('./botconfig.json');
var discord = require('discord.js');


var bot = new discord.Client({
    disableEveryone: true
})

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online.`) 
    bot.user.setPresence({
        game: {
            name: 'Asthriona.com',
            type: "WATCHING",
        }
    }) 
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return

    let prefix = botConfig.prefix
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd === `${prefix}hello`){
        return message.channel.send("hello")
    }
})

bot.login(botConfig.tokenDev)