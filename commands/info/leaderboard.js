module.exports = {
    name: "leaderboard",
    aliases: ["levels", "lb"],
    category: "info",
    description: " ",
    run: async (bot, message, args) => {
        message.channel.send(` Voici le liens du Leaderboard \n http://yukiko.nishikino.me/lb?id=${message.guild.id}`)
    }
}