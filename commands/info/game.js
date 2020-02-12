module.exports = {
    name: "game",
    category: "info",
    description: "change what bot is actually playing.",
    aliases: ["setgame"],
    run: async (bot, message, args) => {
        if(message.author.id === "186195458182479874"){
            bot.user.setStatus('')
            bot.user.setPresence({
                game: {
                    name: args.slice(1).join(" "),
                    type: args[0],
                    url: "https://www.twitch.tv/Asthriona"
                }
        });
        }else{
            return message.reply("Oy! You can't tell me what to do! ");
        }
        
    }
}