var { exec } = require("child_process")
module.exports = {
    name: "update",
    category: "dev",
    description: "Update the bot from github and restart it",
    run: async (bot, message, args) => {
        exec('git pull origin master', (stdout, stderr) =>{
            message.channel.send("update: ```" + stdout + "```")
        })
    }
}