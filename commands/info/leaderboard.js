module.exports = {
    name: "lb",
    aliases: "levels",
    category: "info",
    description: "Send the link to the leaderboard.",
    run: async (bot, message, args) => {
        message.channel.send(` Voici le liens du Leaderboard \n http://yukiko.nishikino.me/lb?id=${message.guild.id}`)
    }
}