module.exports = {
    name: "leaderboard",
    category: "info",
    description: "Show you the 10 leaderboard.",
    run: async (bot, message, args) => {
        Users.find({
            serverID: message.guild.id
        }, function (err, docs) {
            if (err) console.log(err);
            message.reply(docs);
        })
            .sort([["xp", 1], ["xp", "descending"]]);
    }
}