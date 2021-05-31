const Config = require('../botconfig.json')
const Users = require('../model/xp.js');
const Cards = require('../model/card.js');
const {lvlupimg } = require('../Cards.js')
const moment = require('moment');
module.exports = {
    name: 'message',
    once: false,
    async execute(message, bot){
        if(message.author.bot) return;
            //DA NEW XP SYSTEM 2.0
    let xpAdd = Math.ceil(Math.random() * 15);
    let messageAdd = +1


    Users.findOne({
        did: message.author.id,
        serverID: message.guild.id
    }, (err, users) => {
        if (err) console.log(err);
        if (!users) {
            var newUsers = new Users({
                did: message.author.id,
                username: message.author.username,
                serverID: message.guild.id,
                xp: xpAdd,
                level: 0,
                message: messageAdd,
                warns: 0,
                avatarURL: message.author.displayAvatarURL()
            })

            newUsers.save().catch(error => console.log(error));
        } else {
            users.xp = users.xp + xpAdd;
            users.message = users.message + messageAdd
            users.username = message.author.username
            users.avatarURL = message.author.displayAvatarURL()

            let nxtlvl = 300 * Math.pow(2, users.level)
            if (users.xp >= nxtlvl) {
                users.level = users.level + 1

                //lvl up image              
                var sendimg = async function sendimg() {
                    await lvlupimg(message, users);

                }
                sendimg()
            }
            users.save().catch(error => console.log(error));
        }
    });

    //Add default cards to new users
    Cards.findOne({
        did: message.author.id
    }, (err, cards) => {
        if (err) console.log(err)
        if (!cards) {
            var newCards = new Cards({
                did: message.author.id,
                link: "https://cdn.yukiko.app/Cards/DefaultYukikocard.jpg"
            })
            newCards.save().catch(error => console.log(error));
        }
    })
        const date = `${moment().format('L')} ${moment().format('LT')}`
        //Log
        if (message.channel.type === "dm") return console.log(`${date} DM from -> ${message.author.username}: ${message.content}`);
        console.log(` ${date} ${message.guild.name} -> ${message.author.username}: ${message.content}`)
    
        //Setup Prefix and args
        let prefix = Config.prefix;
        let messageArray = message.content.split(" ");
        let args = messageArray.slice(1);
        let cmd = messageArray[0];
    
        if(message.author.bot) return
        if(!prefix) return
    
        //Force mute.
        if (message.member.roles.cache.find(r => r.name === "muted")) {
            message.delete();
            message.author.send("You are muted on " + message.guild.name)
        };
        //Commands Handler
        let commandfile = bot.Commands.get(messageArray[0].slice(prefix.length));
        if (commandfile) commandfile.run(bot, message, args, cmd);
    }
}