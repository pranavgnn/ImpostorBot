module.exports = (seconds) => {
    var numdays = Math.floor(seconds / 86400);
    var numhours = Math.floor((seconds % 86400) / 3600);
    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    var numseconds = ((seconds % 86400) % 3600) % 60;
    if (numdays === 0 && numhours === 0 && numminutes === 0) return `${numseconds} seconds`
    else if (numhours === 0 && numminutes === 0 && numseconds === 0) return `${numdays} days`
    else if (numdays === 0 && numminutes === 0 && numseconds === 0) return `${numhours} hours`
    else if (numdays === 0 && numhours === 0 && numseconds === 0) return `${numminutes} minutes`
    else if (numdays === 0 && numhours === 0) return `${numminutes} minutes ${numseconds} seconds`
    else if (numdays === 0) return `${numhours} hours ${numminutes} minutes ${numseconds} seconds`
    else return `${numdays} days ${numhours} hours ${numminutes} minutes ${numseconds} seconds`
}