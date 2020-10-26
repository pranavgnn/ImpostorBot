exports.config = {
    name: "unclaim",
    cooldown: 10,
    guildOnly: false,
    staffOnly: false,
    description: "Unclaims a Voice Channel if you had previously claimed one.",
    usage: "unclaim",
    category: "Utility",
};

const db = require(`quick.db`);

exports.run = async (bot, message, args, config) => {
    const claimData = await db.fetch(`claims_${message.author.id}`);
    
    if (!claimData) return message.channel.send(`⛔ **|** You don't have any previously claimed Voice Channel to unclaim!`);

    this.unclaim(bot, message.author);
    message.channel.send(`✅ **|** Successfully unclaimed your game with the room code **${claimData.code}** from the Voice Channel **#${claimData.voice.name}** from the server **${claimData.guild.name}**!`);
};

exports.unclaim = async (bot, user) => {
    const claimData = await db.fetch(`claims_${user.id}`);
    const existingVcs = await db.fetch(`claimchannels`);
    const newVcs = [];

    existingVcs.forEach(currentVc => {
        if (currentVc !== claimData.voice.id) newVcs.push(currentVc);
    });

    await db.set(`claimchannels`, newVcs);
    await db.delete(`claims_${user.id}`);

    await bot.channels.cache.get(claimData.voice.id).delete();
    await bot.channels.cache.get(claimData.chatChannel.id).delete();
};