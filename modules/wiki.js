const axios = require('axios');
const config_data = require('../config.js');

async function wiki(word) {

    var umla = { 'ä' : '%C3%A4',
                 'Ä' : '%C3%84',
                 'ö' : '%C3%B6',
                 'Ö' : '%C3%96',
                 'ü' : '%C3%BC',
                 'Ü' : '%C3%9C',
                 'ß' : '%C3%9F'}

    word = word.replace(/[äÄöÖüÜß]/g, u => umla[u])

    var mainconfig = {
        method: 'get',
        url: `https://${config_data.lang}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${word}`
    }

    return axios(mainconfig)
        .then(async function(response) {
            let data = response.data
            dataNum = Object.keys(data.query.pages)[0];
            let data_extract = data.query.pages[dataNum].extract
            return data_extract.substring(0,300)
        })
        .catch(function(error) {
            return console.log('[!wiki] error: ' + error)
        })
}

module.exports = {
    wiki    
}