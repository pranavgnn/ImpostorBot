module.exports = str => {
    if (typeof str !== 'string') return;
    //hours
    if (str.endsWith(`hr`)) {
        var num = parseInt(str.slice(0, 2));
        if (isNaN(num)) return;
        return {time: num * 60 * 60 * 1000, format: "hours"};
    }
    else if (str.endsWith(`h`)) {
        var num = parseInt(str.slice(0, 1));
        if (isNaN(num)) return;
        return {time: num * 60 * 60 * 1000, format: "hours"};
    };

    //minutes
    if (str.endsWith(`min`)) {
        var num = parseInt(str.slice(0, 3));
        if (isNaN(num)) return;
        return {time: num * 60 * 1000, format: "minutes"};
    }
    else if (str.endsWith(`m`)) {
        var num = parseInt(str.slice(0, 1));
        if (isNaN(num)) return;
        return {time: num * 60 * 1000, format: "minutes"};
    };

    //seconds
    if (str.endsWith(`sec`)) {
        var num = parseInt(str.slice(0, 3));
        if (isNaN(num)) return;
        return {time: num * 1000, format: "seconds"};
    }
    else if (str.endsWith(`s`)) {
        var num = parseInt(str.slice(0, 1));
        if (isNaN(num)) return;
        return {time: num * 1000, format: "seconds"};
    };

    //milliseconds
    if (str.endsWith(`ms`)) {
        var num = parseInt(str.slice(0, 2));
        if (isNaN(num)) return {};
        return {time: num, format: "milliseconds"};
    };

    //No prefix
    //if (!isNaN(parseInt(str))) return {time: str, format: "seconds"};
};