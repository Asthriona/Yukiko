module.exports = {
    name: 'ready',
    once: false,
    execute(bot){
        console.log('Setting bot presence...')
        let statues = ["Persona 4 Golden", "Twitter: @YukikoApp", "W/ @Asthriona's Feelings", "w/ Rise", "in my castle", "Bummer! an error happened!"]
        setInterval(function() {
            let status = statues[Math.floor(Math.random()*statues.length)];
            bot.user.setStatus('dnd');
            bot.user.setPresence({game: { name: status, type: "PLAYING"}
        })
    }, 600000)
    console.log('waiting for ready event...')
    console.log(`\x1b[32m${bot.user.username}\x1b[0m is now started and running.`);
    console.log('Init Player manager...')
    bot.manager.init(bot.user.id);
    }
}