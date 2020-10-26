const fs = require(`fs`);
const { MessageEmbed } = require(`discord.js`);

const supportedDirs = ["./support", "./modules", "./commands", "./events", "./node_modules", "./db-models", "./icon"];

//## Cache delete function ##\\
exports.deleteAllCache = (path, bot) => {
    let files = fs.readdirSync(path).filter(file => file.endsWith('.js'));
    console.log(`${files.length} files found.`)
    for (let file of files) {
        console.log(`Command ${file} loading...`)
        delete require.cache[require.resolve(`.${path}/${file}`)];
        let required = require(`.${path}/${file}`);
        if (required.config) bot.commands.set(required.config.name, required);
    };
    console.log(`Done! ${files.length} files from "${path}" directory were successfully loaded!`);
};

//## Reload function ##\\
exports.reload = async (bot, message, args, owner, staff) => {
    var reloadEmbed = new MessageEmbed()
        .setTitle(`Error:`)
        .setDescription(`Staff access only.\nAccess denied.`)
        .setColor(`ff0000`);

    //Permissions check
    if (message.author.id !== owner && !staff.includes(message.author.id)) return message.channel.send(reloadEmbed);

    reloadEmbed.setColor(`#00ff00`);
    reloadEmbed.setTitle(`Reload Successful!`);

    // Single command reload
    if (args[0] && bot.commands.get(args[0].toLowerCase())) {
        delete require.cache[require.resolve(`../commands/${args[0].toLowerCase()}.js`)];
        try {
            var newCommand = require(`../commands/${args[0].toLowerCase()}.js`);
            bot.commands.set(newCommand.config.name, newCommand);
        } catch (error) {
            reloadEmbed.setTitle(`Error while loading command ${args[0].toLowerCase()}`);
            reloadEmbed.setDescription(`\`\`\`${error}\`\`\``);
            return message.channel.send(reloadEmbed);
        };
        reloadEmbed.setDescription(`Successfully reloaded the command ${args[0].toLowerCase()}!`);
        message.channel.send(reloadEmbed);
    }
    else {

        reloadEmbed.setDescription(`Successfully reloaded all files from`);

        // Command directory reload
        if (!args[0]) {
            this.deleteAllCache(`./commands`, bot);
            reloadEmbed.setDescription(`${reloadEmbed.description} \`./commands\`!`);
            return message.channel.send(reloadEmbed);
        };

        const path = args[0].toLowerCase();

        // Specified directory reload
        if (supportedDirs.includes(path)) {
            this.deleteAllCache(path);
            reloadEmbed.setDescription(`${reloadEmbed.description} \`${path}\`!`);
        }

        // Invalid directory input
        else {
            reloadEmbed.setTitle(`Reload failed`);
            reloadEmbed.setDescription(`Reload was unsuccessful because \`${path}\` is not a valid directory.`);
            reloadEmbed.setColor(`#ff0000`);
        };
        message.channel.send(reloadEmbed);
    };
};
