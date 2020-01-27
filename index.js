const { Client, RichEmbed, Collection } = require('discord.js');
const botConfig = require('./botconfig.json')

const bot = new Client({
    disableEveryone: true
});

bot.commands = new Collection();
bot.aliases = new Collection();

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
})

bot.on("ready", () => {
    console.log(`${bot.user.username} is online.`);
    bot.user.setPresence({
        game:{
            name: "coding 2.0!",
            type: "WATCHING"
        }
    })
})

bot.on("message", async message =>{
    //Logging
    console.log(`${message.guild.name} -> ${message.author.username}: ${message.content}`)
    
    let prefix = botConfig.prefix;
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!message.content.startsWith(prefix)) return;
    if(!message.member) message.member = await message.guild.fetchMember(message)

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    if(cmd === 0) return;
    let command = bot.commands.get(cmd);
    if(!command) command = bot.commands.get(bot.aliases.get(cmd))
    if(command)
    command.run(bot, message, args, RichEmbed)

})

bot.login(botConfig.tokenDev)