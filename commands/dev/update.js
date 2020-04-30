var { exec } = require("child_process")
module.exports = {
    name: "update",
    category: "dev",
    description: "Update the bot from github and restart it",
    run: async (bot, message, args) => {
        if (message.author.id === "186195458182479874" || "635422418424299521") {
            exec('git pull origin master', (stdout, stderr) => {
                message.channel.send("update: ```" + stdout + "```")
            })
        }
    }
}