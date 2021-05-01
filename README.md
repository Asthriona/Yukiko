# PROJECT NO LONGER SUPPORTED!
As Yukiko 2.0 (Closed sources) grow I don't have much time to work and update this version. if you need a great bot to help with your Discord guilds please use [Yukiko.app](https://Yukiko.app)  

 [![Discord Bots](https://top.gg/api/widget/status/641626560457342987.svg)](https://top.gg/bot/641626560457342987)
  
## Edit (21/04/21)
You are a lot to still star this thing so I updated it, should be working fine now, and updated to djs 12 and better music system. I didnt put as much work or code quality then in Yukiko.app but its working. Your welcome :)
  
# Yukiko
Yukiko is a pretty powerfull Discord bot that include XP system, Leaderboard, Music, Welcome and farewell message, Moderation, and much more!

This bot is in developement state and actively updated, Feel free to come back take a look to our change logs!


# I want to use it!
Nice! Let me help you!  
### I don't want / don't know how to host it. 
In that case feel free to add the Official Yukiko bot to your Discord server via this [Check on our website to invite Yukiko](https://yukiko.app/) to your server!  

### I want to host it myself!
Okay cool! you save me few bucks for the hosting :3  
Here is the tutorial on how to install and configure the bot!

# Install
To install and use this bot you need few things first.  
## If you are on debian/ubuntu 
```
curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
apt-get install -y nodejs
apt install build-essential 
```
## for Windows:
Install nodeJS from this [link](https://nodejs.org/en/)  
Open a powershell in admin mode `win+x`
You can install gitbash or download the code via [this link](https://github.com/Asthriona/Yukiko/archive/master.zip)
``` 
npm install --global windows-build-tools
```
Then your system should be ready.  
```
git clone https://github.com/Asthriona/Yukiko.git
cd Yukiko
npm install
npm run start
```
For Linux you should install "screen" package to be able to keep the bot running in the background. you can also use [PM2](https://pm2.io/)

# Lavalink
I switched the Music bot to Lavalink and Erela.js for practical reasons (Youtube-DL was a pain to set up in the code and require a lot of ressources.)
Please find [Lavalink](https://github.com/freyacodes/Lavalink-Client) on the Author repo and follow their install instruction (Don't worry thats very easy.)
## Update
The author changed their name to Freyacodes and someone else too their old name, if you google 'Lavalink' you'll find the old name repo, Follow the link upthere to get the right one.  
The [Yukiko Dev Team](https://github.com/Yukiko-Dev-Team) forked it you can follow that link too.

# Configuration
Yukiko's configuration is pretty simple.  
You need a MongoDB database, and a Discord bot  
[Discord Developper portal](https://discordapp.com/developers/applications/)  
[Free mongoDB Database Culsters](https://www.mongodb.com/cloud/atlas)

copy the exemple file
```
cp botconfig.json.exemple botconfig.json 
```
`token` is your Discord bot token  
`prefix` a! by default you can change it for whatever you want.   
`dbLink` The login link of your database. 
  
# Official Discord Server.
For now Yukiko don't have any public place. Just a nice little home called "Dev Bot Zone." This is a private server dedicated to my developement bot.  
If you want to contact me to get some help, or having an idea, please feel free to open an issue, or contact me on Twitter [@Asthriona](https://twitter.com/Asthriona)
for bug report, please open an issue, and give me all the information you have!  
(She have very quite room mate, one of them is a [wall](https://github.com/Asthriona/TheWallDiscordBot)!)  
![devServer](https://asthriona.s3.fr-par.scw.cloud/ShareX/2021/05/Discord_020521-011537AM.png)  

# Modification
You can modify the bos as you pleased. But you have to credit me, and my collaborator.   
Please leave the credit in the "bot info" commands.

# Help me
Hi, I'am [Asthriona](https://Asthriona.com) Full time WoW player, and some kind of developper. i'm doing stuff on internet for quite a long time... a decade now, and I love making stuff that can be usefull or help other.  
But if you want to help me, Feel free to take a look at the code, Create issue for idea/bugs, or pull request.  
  
  As I said, i'm full time doing this, and now days, being indie developper don't really pay the bills (not even talking about server bill.), so if you really want to help, and have some bucks to spare, Feel free to pay me a ko-fi   
    
  [![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/C0C61FCVH)

  Thanks for your interest in Yukiko! <3
