require('dotenv').config()
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const helmet = require('helmet');
const port = process.env.PORT;

const server = express();
server.use(cors());
server.use(helmet());

const newsPapers = [
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/interactive/2021/us/covid-cases.html',
        base: 'https://www.nytimes.com'
    },
    {
        name: 'theguardian',
        address: 'https://www.theguardian.com/world/coronavirus-outbreak',
        base: 'https://www.theguardian.com'
    },
    {
        name: 'washingtonpost',
        address: 'https://www.washingtonpost.com/coronavirus/',
        base: 'https://www.washingtonpost.com'
    },
    {
        name: 'usatoday',
        address: 'https://www.usatoday.com/news/coronavirus/',
        base: ''
    },
    {
        name: 'wsj',
        address: 'https://www.wsj.com/news/collection/coronavirus0312-256f2943',
        base: 'https://www.usatoday.com'
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/projects/california-coronavirus-cases-tracking-outbreak/',
        base: 'https://www.latimes.com'
    },
    {
        name: 'nypost',
        address: 'https://nypost.com/coronavirus/',
        base: 'https://nypost.com'
    },
    {
        name: 'chicagotribune',
        address: 'https://www.chicagotribune.com/coronavirus/',
        base: 'https://www.chicagotribune.com'
    },
    {
        name: 'startribune',
        address: 'https://www.startribune.com/local/coronavirus/',
        base: 'https://www.startribune.com'
    },
    {
        name: 'dailymail',
        address: 'https://www.dailymail.co.uk/news/coronavirus/index.html',
        base: 'https://www.dailymail.co.uk'
    },
    {
        name: 'newsday',
        address: 'https://projects.newsday.com/long-island/tracking-the-coronavirus-on-long-island/',
        base: 'https://projects.newsday.com/'
    },
    {
        name: 'bostonglobe',
        address: 'https://www.bostonglobe.com/nation/special-reports/coronavirus/',
        base: 'https://nypost.com'
    },
    {
        name: 'houstonchronicle',
        address: 'https://www.houstonchronicle.com/coronavirus/',
        base: 'https://www.houstonchronicle.com'
    },
    {
        name: 'sfchronicle',
        address: 'https://www.sfchronicle.com/coronavirus/',
        base: 'https://www.sfchronicle.com'
    },
    {
        name: 'detroitnews',
        address: 'https://www.detroitnews.com/news/nation-world/coronavirus/',
        base: 'https://www.detroitnews.com'
    },

];

const news = [];

newsPapers.forEach((newsPaper) => {
    axios.get(newsPaper.address).then((response) => {
        const data = response.data;
        const $ = cheerio.load(data);
        $('a:contains("virus")', data).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');
            news.push({
                source: newsPaper.name,
                title,
                url,

            });
        });
    });
});

server.get('/', (req, res) => {
    res.status(200).json('Welcome to Coronavirus News API');
});
server.get('/news', async (req, res) => {
    const result = await news
    res.json(result);
});

server.get('/news/:newsPaperId', async (req, res) => {
    const id = req.params.newsPaperId
    const address = await newsPapers.filter(newspaper => newspaper.name === id)[0].address

    axios.get(address)
        .then(response => {
            const data = response.data;
            const $ = cheerio.load(data);
            const specificNews = []
            $('a:contains("virus")', data).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');
                specificNews.push({
                    source: id,
                    title,
                    url,

                });
            });
            res.status(200).json(specificNews);
        }).catch(error => {
            console.log(error);
        })


})

server.listen(port, function () {
    console.log('Server running on port %s', port);
});
