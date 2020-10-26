module.exports = (perms) => {
    if (!perms || perms === []) return `None`
    var formattedPerms = ''
        for (let perm of perms) {
            var words = perm.split(`_`)
            for (let word of words) {
                var letter_1 = word.slice(0, 1)
                var rest = word.slice(1)
                letter_1 = letter_1.toUpperCase()
                rest = rest.toLowerCase()
                formattedPerms += (letter_1 + rest)
                if (word !== words[words.length - 1]) formattedPerms += ' '
            }
            if (perm !== perms[perms.length - 1]) formattedPerms += `, `
        }
        return formattedPerms 
}