module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member){
        const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if (!channel) {
        const channel = member.guild.channels.find(channel => channel.name === "bienvenue");
        return await WelcomeCad(member, channel);
    } else {
        return await WelcomeCad(member, channel);
    }
    }
};