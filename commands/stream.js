var discord = require('discord.js');
var superagent = require('superagent');
var axios = require('axios');
var ClientID = "uic9hxe7wdq8hn9ad3z4lg97qghs1b"

module.exports.run = async (bot, message, args) => {
  var streamerid = args.join(" ");
  const helix = axios.create({
    baseURL: 'https://api.twitch.tv/helix/streams',
    headers: {'Client-ID': ClientID}
  });
  helix.get('?user_login='+streamerid).then(function(res) {
    console.log(res.data.data[0].title)
  
    if(message.author.id === "186195458182479874"){
    bot.user.setPresence({
        game: {
            name: res.data.data[0].title,
            type: "Streaming",
            url: "https://www.twitch.tv/"+res.data.data[0].user_name,
            largeImageURL: "https://static-cdn.jtvnw.net/previews-ttv/live_user_ragingravage-1920x1080.jpg"
        }
    })
}
})
}
module.exports.help = {
    name: "stream",
    description: 'for later ...'
}