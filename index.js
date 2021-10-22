const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors')
const helmet = require('helmet')
const port = 5000;


const server = express();
server.use(cors());
server.use(helmet());
const news = []
server.get('/', (req, res) => {
    res.status(200).json('Welcome to Coronavirus News API');
});
server.get('/news', (req, res) => {
    axios
        .get('https://www.theguardian.com/world/coronavirus-outbreak')
        .then((response) => {
            const data = response.data;
            const $ = cheerio.load(data);
            $('a:contains("coronavirus")', data).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href');
                news.push({
                    title,
                    url,
                })
            });
            res.status(200).json(news)
        })
        .catch((err) => {
            console.log(err);
        });
});

server.listen(port, function () {
    console.log('Server running on port %s', port);
});
