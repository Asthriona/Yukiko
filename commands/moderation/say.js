var discord = require("discord.js");


module.exports.run = async (bot, message, args) => {
    //say
    message.channel.startTyping()
    console.log(`${message.author.username} used !say`)
    if(message.author.id === "186195458182479874"){ 
    let botmessage = args.join(" ");
    message.delete().catch();
    console.log(`${message.author.username} -> ${botmessage}`)
    setTimeout(function(){ 
        message.channel.stopTyping();
        message.channel.send(botmessage);
    }, 3000);
}else{
    setTimeout(function(){ 
        return message.reply("Oy! t'as pas le droit de me dire ce que je doit dire! :'c");
    }, 4000);
}
}

module.exports.help = {
    name: "say",
    description: "THE WALL SAID SOMETHING! YOU BETTER LISTEN!"
}

