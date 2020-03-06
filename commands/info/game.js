module.exports = {
    name: "game",
    category: "info",
    description: "change what bot is actually playing.",
    aliases: ["setgame"],
    run: async (bot, message, args) => {
        if(message.member.hasPermission("BAN_MEMBERS")){
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