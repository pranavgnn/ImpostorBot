exports.config = {
    name: "claim",
    cooldown: 10,
    guildOnly: false,
    staffOnly: false,
    description: "Claims a Voice Channel for you, meaning you can server mute everyone when you mute yourself.",
    usage: "claim <Room Code>",
    category: "Utility",
};

const db = require(`quick.db`);

exports.run = async (bot, message, args, config) => {
    const vc = message.member.voice.channel;
    const claimData = await db.fetch(`claims_${message.author.id}`);
    const existingVcs = await db.fetch(`claimchannels`) || [];

    if (!vc) return message.channel.send(`⛔ **|** You need to be in a Voice Channel to claim it!`);
    if (existingVcs.includes(vc.id)) return message.channel.send(`⛔ **|** This channel has already been claimed!`);
    if (claimData) return message.channel.send(`⛔ **|** You already have a Voice Channel claimed! (**#${claimData.voice.name}** in **${claimData.guild.name}**)`);
    if (!args[0]) return message.channel.send(`⛔ **|** Please specify the room code.`);
    if (args[0].length !== 6) return message.channel.send(`⛔ **|** The code you entered is less/more than six digits, hence invalid.`);

    const letters = args[0].split('')
    for (let letter of letters) {
        if (!isNaN(parseInt(letter))) return message.channel.send(`⛔ **|** The code you entered contains a number, hence invalid.`);
    };

    const createdChannel = await message.guild.channels.create(
        require(`../modules/boldLetters.js`).convert(args[0].toUpperCase()),    
    {
        type: "text",
        topic: `**Claimer**: ${message.author.tag}\n**Room Code**: ${args[0].toUpperCase()}`,
        parent: message.channel.parent
    });

    createdChannel.send(vc.members.map(u=>u).join(`, `));

    const createdVc = await message.guild.channels.create(
        `Code: ${args[0].toUpperCase()}`,
        {
            type: "voice",
            parent: vc.parent
        }
    );

    vc.members.forEach(async member => {
        await member.voice.setChannel(createdVc, `Claimed by ${message.author.tag}`);
    });

    await db.set(`claims_${message.author.id}`, {
            voice: {
                name: createdVc.name,
                id: createdVc.id
            },
            chatChannel: {
                name: createdChannel.name,
                id: createdChannel.id
            },
            guild: {
                name: message.guild.name,
                id: message.guild.id
            },
            channel: {
                id: message.channel.id,
            },
            user: {
                id: message.author.id,
                tag: message.author.tag,
            },
            code: args[0].toUpperCase(),
        }
    );

    existingVcs.push(createdVc.id);
    await db.set(`claimchannels`, existingVcs);

    message.channel.send(`✅ **|** You have successfully claimed **${createdChannel}**!`);
};