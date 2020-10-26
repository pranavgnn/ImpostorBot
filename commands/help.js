exports.config = {
    name: "help",
    aliases: ["commands", "cmds"],
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Sends a neat embed regarding the information of all commands/categories.",
    usage: "help [Command / Category]",
    category: "Miscellaneous",
};

const fs = require(`fs`)
const Discord = require(`discord.js`)

const { PREFIX } = require(`../config.json`)

let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

exports.run = async (bot, message, args) => {
    var helpCommand = new Discord.MessageEmbed()
        .setTitle(`Displaying help for`)
        .setColor(`#eb98ff`)
        .setFooter(`<> means required.   |   [] means optional.\nFor help with a specific command / category, do ${PREFIX}help [Command / Category]`)
    var commands = []
    var groups = []
    for (let cmd of commandFiles) {
        var file = require(`../commands/${cmd}`);
        if (!commands.includes(file)) commands.push(file)
        if (!groups.includes(file.config.category.toLowerCase())) groups.push(file.config.category.toLowerCase())
    };
    helpCommand.setDescription(`${commands.length} commands | ${groups.length} groups`)
    if (!args[0]) {
        for (let group of groups) {
            helpCommand.addField(`${group.slice(0, 1).toUpperCase() + group.slice(1).toLowerCase()}`, `$help ${group}`, true)
        }
        helpCommand.setTitle(helpCommand.title + ` all commands.`)
        message.channel.send(helpCommand)
    } else {
        var requiredCmd
        try {
            requiredCmd = require(`../commands/${args[0]}`)
        } catch {}
        if (requiredCmd) {
            helpCommand.setTitle(helpCommand.title + ` command ${requiredCmd.config.name}.`)
            helpCommand.addField(`Description`, requiredCmd.config.description)
            helpCommand.addField(`Usage`, PREFIX + requiredCmd.config.usage)
            helpCommand.addField(`Category`, requiredCmd.config.category)
            helpCommand.addField(`Server Only`, requiredCmd.config.guildOnly)
            helpCommand.addField(`Bot Staff Only`, requiredCmd.config.staffOnly)
            helpCommand.addField(`Cooldown`, require(`../modules/secondsToDhms.js`)(requiredCmd.config.cooldown || 3))
            helpCommand.addField(`Aliases`, requiredCmd.config.aliases && requiredCmd.config.aliases.join(`, `) || `None`)
            helpCommand.addField(`Required Permissions`, require(`../modules/sortPermissions.js`)(requiredCmd.config.permissions))
            message.channel.send(helpCommand)
        } else if (groups.includes(args.join(` `).toLowerCase())) {
            for (let cmd of commandFiles) {
                var file = require(`../commands/${cmd}`);
                if (file.config.category.toLowerCase() === args.join(` `).toLowerCase()) helpCommand.addField(file.config.name, file.config.description)
            }
            helpCommand.setTitle(helpCommand.title + ` category ${args.join(` `).toLowerCase()}.`)
            message.channel.send(helpCommand)
        } else message.channel.send(`Unfortunately, there was no command or category that I found with the keyword \`${args.join(` `)}\`.`)
    }
    message.react(`✅`)
};