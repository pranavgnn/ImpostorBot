const { OWNER,
        STAFF
} = require(`../config.json`);

module.exports = async (user, perms) => {
    if (user.id === OWNER || STAFF.includes(user.id)) return true;
    if (user.hasPermission([perms])) return true;
    else return require(`./sortPermissions.js`)(perms);
};