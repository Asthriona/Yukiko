module.exports = {
    name: "ping",
    category: "info",
    description: "return bot latency and API ping.",
    run: async (bot, message, args) => {
        var msg = await message.channel.send("Waiting for the ball!")
        msg.edit(`**Pong!** \n latency: ${Math.floor(msg.createdAt - message.createdAt)}ms. \n API latency: ${Math.round(bot.ping)}ms.`)
    }
}