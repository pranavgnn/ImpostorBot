exports.config = {
    name: "unclaim",
    guildOnly: false,
    staffOnly: false,
    description: "Unclaims a Voice Channel if you had previously claimed one.",
    usage: "unclaim",
    category: "Utility",
};

const db = require("../support/database.js");

exports.run = async (bot, message, args, config) => {
    const foundClaim = await db.fetch(db.claims, {_id: message.author.id});
    if (!foundClaim) return message.channel.send(`⛔ **|** You don't have any previously claimed Voice Channel to unclaim!`);

    this.unclaim(bot, foundClaim);
    message.channel.send(`✅ **|** Successfully unclaimed your game with the room code **${foundClaim.code}**!`);
};

exports.unclaim = async (bot, data) => {
    data.delete();
    await bot.channels.cache.get(data.voiceId).delete();
    await bot.channels.cache.get(data.chatChannelId).delete();
};