const chars = {
    "a": "", "A": "𝗔",
    "b": "", "B": "𝗕",
    "c": "", "C": "𝗖",
    "d": "", "D": "𝗗",
    "e": "", "E": "𝗘",
    "f": "", "F": "𝗙",
    "g": "", "G": "𝗚",
    "h": "", "H": "𝗛",
    "i": "", "I": "𝗜",
    "j": "", "J": "𝗝",
    "k": "", "K": "𝗞",
    "l": "", "L": "𝗟",
    "m": "", "M": "𝗠",
    "n": "", "N": "𝗡",
    "o": "", "O": "𝗢",
    "p": "", "P": "𝗣",
    "q": "", "Q": "𝗤",
    "r": "", "R": "𝗥",
    "s": "", "S": "𝗦",
    "t": "", "T": "𝗧",
    "u": "", "U": "𝗨",
    "v": "", "V": "𝗩",
    "w": "", "W": "𝗪",
    "x": "", "X": "𝗫",
    "y": "", "Y": "𝗬",
    "z": "", "Z": "𝗭",

    "0": "",
    "1": "",
    "2": "",
    "3": "",
    "4": "",
    "5": "",
    "6": "",
    "7": "",
    "8": "",
    "9": "",
};

module.exports.convert = character => {
    if (character.length === 0) return;
    else if (character.length === 1) {
        if (chars[character]) return chars[character];
    } else {
        var sentence = ``;
        var letters = character.split(``);
        for (let letter of letters) {
            sentence = sentence + (chars[letter] || `_`);
        };
        return sentence;
    };
};