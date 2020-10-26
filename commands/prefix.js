exports.config = {
    name: "prefix",
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Adds / Removes a prefix that you specified.",
    usage: "prefix <\"Add\" / \"Remove\"> <Prefix>",
    category: "Management",
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args, config) => {
    var prefixes = await db.fetch(`prefixes_${message.guild.id}`) || []
    if (!args[0]) {
        var viewEmbed = new MessageEmbed()
            .setColor(config.COLOR)
            .setTitle(`Prefixes for ${message.guild.name}`)
        viewEmbed.setDescription(`1. <@${bot.user.id}>\n`)
        prefixes.forEach((prefix, i) => {
            viewEmbed.setDescription(`${viewEmbed.description || ``}${i + 2}. **${prefix}**\n`)
        })
        return message.channel.send(viewEmbed)
    }
    require(`../modules/checkPermission.js`)(message.member, [`MANAGE_SERVER`]).then(async hasPerm => {
        if (typeof hasPerm === `string`) return message.channel.send(new MessageEmbed().setTitle(`You don't have permissions!`).setDescription(`This command requires the permissions:\`\`\`${hasPerm}\`\`\``).setColor(`#ff3d3d`))
        if (!args[1]) return message.channel/send(`🚫 | Please specify a prefix to add/remove.`)
        if (args[0].toLowerCase() === `add`) {
            if (prefixes.includes(args[1])) return message.channel.send(`🚫 | That prefix is already set for your server!`)
            var newPrefixes = prefixes
            newPrefixes.push(args[1])
            await db.set(`prefixes_${message.guild.id}`, newPrefixes)
            message.channel.send(`Successfully added the prefix \`${args[1]}\`.`)
        } else if (args[0].toLowerCase() === `remove`) {
            if (args[1] === `<@!${bot.user.id}>` || args[1] === `<@${bot.user.id}>`) return message.channel.send(`🚫 | ${bot.user} is a system prefix that can not be removed.`)
            if (!prefixes.includes(args[1])) return message.channel.send(`🚫 | That prefix isn't set for your server!`)
            var newPrefixes = []
            prefixes.forEach(currentPrefix => {
                if (currentPrefix !== args[1]) newPrefixes.push(currentPrefix)
            })
            await db.set(`prefixes_${message.guild.id}`, newPrefixes)
            message.channel.send(`Successfully removed the prefix \`${args[1]}\`.`)
        } else return message.channel.send(`🚫 | That is not a valid method! Choose any one: \`Add\`, \`Remove\``)
    })
}

