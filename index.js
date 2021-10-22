const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const port = 5000;

const server = express();

server.get('/', (req, res) => {
    res.status(200).json('Welcome to Coronavirus News API');
});
server.get('/news', (req, res) => {
    axios
        .get('https://www.theguardian.com/world/coronavirus-outbreak')
        .then((res) => {
            const data = res.data;
            const $ = cheerio.load(data);
            $('a:contains("coronavirus)', data).each(function () {

            })
        })
        .catch((err) => {
            console.log(err);
        });
});

server.listen(port, function () {
    console.log('Server running on port %s', port);
});
