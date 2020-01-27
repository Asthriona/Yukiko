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
                    name: args.join(" "),
                    type: "PLAYING",
                    url: "https://www.twitch.tv/Asthriona"
                }
        });
        }else{
            return message.reply("Oy! Tu peut pas changer le jeu au quelle je joue! c'est moi qui decide!");
        }
        
    }
}