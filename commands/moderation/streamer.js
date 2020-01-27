var discord = require('discord.js');
var superagent = require('superagent');
var axios = require('axios');
var botConfig = require('../botconfig.json')
var ClientID = botConfig.twitchCID

module.exports.run = async (bot, message, args) => {
  var streamerid = args.join(" ");
  const helix = axios.create({
    baseURL: 'https://api.twitch.tv/helix/streams',
    headers: {'Client-ID': ClientID}
  })
  helix.get('?user_login='+streamerid).then(function(res) {
  var info = res.data.data[0]
  if(res.data.data["id"] === null) return message.reply("User is not Streaming.")
    if(message.author.id === "186195458182479874"){
    var streamerembed = new discord.RichEmbed()
    .setTitle("Info for: " + streamerid)
    .setDescription(streamerid+" is actually " + info.type)
    .addField("Title:", info.title, true)
    .addField("viewer Count", info.viewer_count, true)
    .addField("Game:", info.game_id, true)
    .setThumbnail("https://static-cdn.jtvnw.net/previews-ttv/live_user_"+streamerid+"-1920x1080.jpg")
    if (err) {
      message.reply("An Error happened. \n ```" + err + "```")
    } else {
      message.reply(streamerembed)
    }
    
}
}).catch(err => message.channel.send(streamerid+" is not Streaming. \n or an error happened. ```"+err+"```"));
}
module.exports.help = {
    name: "stream-info",
    description: 'for later ...'
}