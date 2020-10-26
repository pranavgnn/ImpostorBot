exports.table = {
    "a": "z", "A": "Z",
    "b": "y", "B": "Y",
    "c": "x", "C": "X",
    "d": "w", "D": "W",
    "e": "v", "E": "V",
    "f": "u", "F": "U",
    "g": "t", "G": "T",
    "h": "s", "H": "S",
    "i": "r", "I": "R",
    "j": "q", "J": "Q",
    "k": "p", "K": "O",
    "l": "o", "L": "O",
    "m": "n", "M": "N",
    "n": "m", "N": "M",
    "o": "l", "O": "L",
    "p": "k", "P": "K",
    "q": "j", "Q": "J",
    "r": "i", "R": "I",
    "s": "h", "S": "H",
    "t": "g", "T": "G",
    "u": "f", "U": "F",
    "v": "e", "V": "E",
    "w": "d", "W": "D",
    "x": "c", "X": "C",
    "y": "b", "Y": "B",
    "z": "a", "Z": "A",

    "0": "9",
    "1": "8",
    "2": "7",
    "3": "6",
    "4": "5",
    "5": "4",
    "6": "3",
    "7": "2",
    "8": "1",
    "9": "0",
};

exports.convert = character => {
    if (character.length === 0) return;
    else if (character.length === 1) {
        if (this.table[character]) return this.table[character];
    } else {
        var sentence = ``;
        var letters = character.split(``);
        for (let letter of letters) {
            sentence = sentence + (this.table[letter] || letter);
        }
        return sentence;
    };
};

console.log(this.convert(`Orob, R olev blf FdF`))