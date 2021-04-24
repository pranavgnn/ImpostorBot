const Discord = require(`discord.js`);

const config = require(`../config.json`);

const whClient =  new Discord.WebhookClient(`770149584894558209`, process.env.WEBHOOK_TOKEN);

exports.loginLog = async (bot) => {
    whClient.send(new Discord.MessageEmbed()
        .setColor(config.COLOR)
        .setTitle(`Logged in!`)
        .setDescription(`**Username**: ${bot.user.username}\n**Discriminator**: #${bot.user.discriminator}\n**ID**: ${bot.user.id}\n**Presence**: ${bot.user.presence.activities[0].type.toLocaleLowerCase()} ${bot.user.presence.activities[0].name}`)
        .setThumbnail(bot.user.avatarURL())
        .setTimestamp(Date.now())
    );
};

exports.commandLog = async (bot, command, args, message) => {
    whClient.client.send(new Discord.MessageEmbed()
        .setColor(config.COLOR)
        .setTitle(`Command ${command.config.name.toUpperCase()} issued`)
        .setDescription(`**Issued by**: ${message.author.tag}\n**Arguments supplied**: ${args.join(`, `) || `None`}\n\n**__COMMAND INFO__**\n**Name**: ${command.config.name}\n**Description**: ${command.config.description}\n**Aliases**: ${(command.config.aliases || [`None`]).join(`, `)}\n**Cooldown**: ${command.config.cooldown}\n**Usage**: ${config.PREFIXES[0] + command.config.usage}\n**Category**: ${command.config.category}`)
        .setTimestamp(Date.now())
    );
};

exports.noCommandLog = async (bot, command, args, message) => {
    whClient.client.send(new Discord.MessageEmbed()
        .setColor(config.COLOR)
        .setTitle(`Command ${command.toUpperCase()} not found`)
        .setDescription(`**Issued by**:${message.author.tag}\n**Arguments supplied**: ${args.join(`, `) || `None`}\n\n**ERROR**: Couldn't find the command.`)
        .setTimestamp(Date.now())
    );
};