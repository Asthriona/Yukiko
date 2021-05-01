var Discord = require("discord.js")
module.exports = {
    name: "invit",
    category: "info",
    description: "Create an invitation to this server",
    run: async (bot, message, args) => {
        message.channel.createInvite()
  .then(invite => message.channel.send(`Here is your invitation! => \n ${invite}`))
  .catch(console.error);
    }
}