require('dotenv').config();
const Discord = require('discord.js');

const config = require('./config.json');
const logs = require(`./support/botLogs`);
const db = require("./support/database.js")

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

bot.on('ready', () => {
    console.log(`${bot.user.username} came online!`);

    bot.user.setPresence({ activity: { name: `as an Impostor` } })
        .then(() => {
            console.log(`Changed the presence of ${bot.user.username} to "${bot.user.presence.activities[0].name}".`);
            logs.loginLog(bot);
        })
        .catch(console.error);
});

require(`./support/reload.js`).deleteAllCache(`./commands`, bot);

bot.on('voiceStateUpdate', async (oldUser, newUser) => {
    const foundClaim = await db.fetch(db.claims, {_id: newUser.id})
    if (!foundClaim) return;

    if (!newUser.channel || foundClaim.voiceId !== newUser.channel.id) {
        require(`./commands/unclaim.js`).unclaim(bot, foundClaim);
        return bot.channels.cache.get(foundClaim.channelId).send(`<@!${foundClaim._id}>, you were automatically unclaimed from the voice channel **#${oldUser.channel.name}** with the room code **${foundClaim.code}** in the server **${oldUser.guild.name}** because you either disconnected or switched voice channels.`)
    };

    newUser.channel.members.forEach(user => {
        if (user.id !== foundClaim._id)
            user.voice.setMute(newUser.selfMute, `Claim by ${foundClaim._id}`);
    });
});

bot.on('message', async message => {

    //Ignore bots amd webhooks
    if (message.author.bot) return;
    if (message.webhookID) return;


    const prefix = require(`./support/prefix.js`)(message, bot.user.id);

    // Prefix validation
    if (!prefix) return;

    // Util variables
    var msg = message.content;
    var cont = msg.slice(prefix.length).split(/ +/);
    var command = cont[0].toLowerCase();
    var args = cont.slice(1);

    // Reload command
    if (command === 'reload') require(`./support/reload.js`).reload(bot, message, args, config.OWNER, config.STAFF);

    // Command fetching
    var cmd = bot.commands.get(command) || bot.commands.find(c => c.config.aliases && c.config.aliases.includes(command));
    if (!cmd) return logs.noCommandLog(bot, command, args, message);

    // Staff only commands
    if (cmd.config.staffOnly)
        if (message.author.id !== config.OWNER && !config.STAFF.includes(message.author.id))
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`Staff access only.\nAccess denied.`)
                .setColor(`ff0000`)
            );

    // Guild only commands
    if (cmd.config.guildOnly && message.channel.type !== 'text')
        return message.reply(`I can't execute the ${cmd.config.name} command inside DMs!`);

    // Run the command
    logs.commandLog(bot, cmd, args, message);
    cmd.run(bot, message, args, config);
});

bot.login(process.env.TOKEN);