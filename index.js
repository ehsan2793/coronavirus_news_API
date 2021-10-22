const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const port = 5000

const server = express()


server.get('/', (req, res) => {
    res.status(200).json("Welcome to Coronavirus News API")
})

server.listen(port, function () {

    console.log('Server running on port %s', port)
})