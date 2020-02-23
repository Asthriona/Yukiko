var { RichEmbed } = require("discord.js");
var beautify = require("beautify")
var pjson = require('../../package.json');
module.exports = {
    name: "eval",
    category: "dev",
    description: "Run some code directly in discord! (developper only!)",
    run: async (bot, message, args) => {
        if(!message.author.id === "186195458182479874") return message.reply("You are not a developper! you can't run code just like that!")
        if(!args[0])message.channel.send("Please gimme some good code!")

        try {
            if(args.join(" ").toLowerCase().includes("token")){
                return message.channel.send("No, I'm not gonna give you my token! Nice try tho!")
            }
            var toEval = args.join(" ")
            var evaluated = eval(toEval);

            let embed = new RichEmbed()
            .setColor("PURPLE")
            .setTimestamp()
            .setFooter(bot.user.username, bot.user.displayAvatarURL)
            .setTitle("Elva")
            .addField("To Evaluate:", `\`\`\`js\n${beautify(args.join(" "), {format: "js"})}\n\`\`\``)
            .addField("Evaluated:", evaluated)
            .addField("Type of:", typeof(evaluated))

            message.channel.send(embed)
        } catch (e) {
            message.channel.send("ERROR! \n ```" + e + "```")
        }
    }
}