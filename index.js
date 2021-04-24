require('dotenv').config();
require('./support/server.js').init();
const Discord = require('discord.js');
const slashCommands = require("slash-commands-discord");

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
            require(`./support/reload.js`).deleteAllCache(`./commands`, bot);
        })
        .catch(console.error);
});

//require(`./support/reload.js`).deleteAllCache(`./commands`, bot);

const staffOnly = (cmd, authorId) => {
    if (cmd.config.staffOnly)
        if (authorId !== config.OWNER && !config.STAFF.includes(authorId))
            return new Discord.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`Staff access only.\nAccess denied.`)
                .setColor(`ff0000`)
}

bot.on('voiceStateUpdate', async (oldUser, newUser) => {
    const foundClaim = await db.fetch(db.claims, { _id: newUser.id })
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
    let isStaffOnly = staffOnly(cmd, message.author.id);
    if (isStaffOnly) message.channel.send(isStaffOnly);

    // Guild only commands
    if (cmd.config.guildOnly && message.channel.type !== 'text')
        return message.reply(`I can't execute the ${cmd.config.name} command inside DMs!`);

    // Run the command
    logs.commandLog(bot, cmd, args, message);
    cmd.run(bot, message, args, config);
});

bot.ws.on('INTERACTION_CREATE', async interaction => {
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    var cmd = bot.commands.get(command);

    // Staff only commands
    let isStaffOnly = staffOnly(cmd, interaction.member.user.id);
    if (isStaffOnly)
        bot.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: { embeds: [isStaffOnly] }
            }
        });

        let channel = bot.channels.cache.get(interaction.channel_id);
        let user = channel.guild.members.cache.get(interaction.member.user.id);
        user.tag = interaction.member.user.username + "#" + interaction.member.user.discriminator;
        console.log(channel, user)
        let message = {
            member: user,
            author: user,
            channel: {
                send: (parse) => {
                    let content = {
                        data: {
                            type: 4,
                            data: {}
                        }
                    };
                    if (typeof parse == "string") content.data.data.content = parse;
                    else content.data.data.embeds = [parse];

                    bot.api.interactions(interaction.id, interaction.token).callback.post(content);
                },
                parent: channel.parent,
                id: channel.id,
            },
            guild: channel.guild
        };
    
        logs.commandLog(bot, cmd, args, message);
        cmd.run(bot, message, args, config);
});

bot.login(process.env.TOKEN);