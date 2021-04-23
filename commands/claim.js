exports.config = {
    name: "claim",
    guildOnly: false,
    staffOnly: false,
    description: "Claims a Voice Channel for you, meaning you can server mute everyone when you mute yourself.",
    usage: "claim <Room Code>",
    category: "Utility",
};

const db = require("../support/database.js");

exports.run = async (bot, message, args, config) => {
    const vc = message.member.voice.channel;
    if (!vc) return message.channel.send(`⛔ **|** You need to be in a Voice Channel to claim it!`);

    if (await db.fetch(db.claims, {_id: message.author.id}))
        return message.channel.send(`⛔ **|** You already have a Voice Channel claimed!`);

    if (await db.fetch(db.claims, {voiceId: vc.id}))
        return message.channel.send(`⛔ **|** This channel has already been claimed!`);

    if (!args[0]) return message.channel.send(`⛔ **|** Please specify the room code.`);
    if (args[0].length !== 6) return message.channel.send(`⛔ **|** The code you entered is less/more than six digits, hence invalid.`);

    for (let letter of args[0].split('')) {
        if (!isNaN(parseInt(letter))) return message.channel.send(`⛔ **|** The code you entered contains a number, hence invalid.`);
    };

    const createdChannel = await message.guild.channels.create(
        require(`../modules/boldLetters.js`).convert(args[0].toUpperCase()),    
    {
        type: "text",
        topic: `**Claimer**: ${message.author.tag}\n**Room Code**: ${args[0].toUpperCase()}`,
        parent: message.channel.parent
    });

    const createdVc = await message.guild.channels.create(
        `Code: ${args[0].toUpperCase()}`,
        {
            type: "voice",
            parent: vc.parent
        }
    );

    createdChannel.send(vc.members.map(u=>u).join(`, `));
    vc.members.forEach(async member => {
        await member.voice.setChannel(createdVc, `Claimed by ${message.author.tag}`);
    });

    new db.claims({
        _id: message.author.id,
        voiceId: createdVc.id,
        chatChannelId: createdChannel.id,
        channelId: message.channel.id,
        code: args[0].toUpperCase()
    }).save();

    message.channel.send(`✅ **|** You have successfully claimed the Voice Channel: **#${createdVc.name}**!`);
};