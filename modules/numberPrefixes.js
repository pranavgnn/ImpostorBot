module.exports = number => {
    if (isNaN(parseInt(number))) return;
    if (`${number}`.endsWith(`1`)) return `${number}st`;
    else if (`${number}`.endsWith(`2`)) return `${number}nd`;
    else if (`${number}`.endsWith(`3`)) return `${number}rd`;
    else return `${number}th`;
};