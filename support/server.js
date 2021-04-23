const express = require('express');
const app = express();
const port = 3000;

exports.init = () => {
    app.get('/', (_, res) => res.send('Hello World!'));
    app.listen(port, () => console.log(`Bot WebServer istening at http://localhost:${port}!`));
};