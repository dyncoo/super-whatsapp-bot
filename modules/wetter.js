const axios = require('axios');
const config_data = require('../config.js');


async function plzWetter(plz) {

    var mainconfig = {
        method: 'get',
        url: `http://api.openweathermap.org/data/2.5/weather?zip=${plz},de&APPID=${config_data.openweather}`
    }

    return axios(mainconfig)
        .then(async function(response) {
            var data = response.data
            var out = ({
                place: `${data.name}, ${data.sys.country}`,
                current_temp: (data.main.temp-273.15).toFixed(1),
                temp_min: (data.main.temp_min-273.15).toFixed(1),
                temp_max: (data.main.temp_max-273.15).toFixed(1),
                current_humidity: data.main.humidity,
                current_observation: data.weather[0].main,
                current_wind: data.wind.speed,
                lon: data.coord.lon,
                lat: data.coord.lat
            })
            return out
        })
        .catch(function(error) {
            return "error"
        })
}

async function stadtWetter(stadt) {

    var umla = { 'ä' : '%C3%A4',
                 'Ä' : '%C3%84',
                 'ö' : '%C3%B6',
                 'Ö' : '%C3%96',
                 'ü' : '%C3%BC',
                 'Ü' : '%C3%9C',
                 'ß' : '%C3%9F'}

    stadt = stadt.replace(/[äÄöÖüÜß]/g, u => umla[u])
    stadt = stadt.replace(" ","%20")

    var getPLZ = {
        method: 'get',
        url: `https://app.zipcodebase.com/api/v1/code/city?apikey=${config_data.zipcode}&city=${stadt}&country=de`
    }

    const plz = await axios(getPLZ)
        .then(async function(response) {
            var stadtresponse = response.data
            var plz_data = stadtresponse.results[0]
            return plz_data
        })

        var mainconfig = {
            method: 'get',
            url: `http://api.openweathermap.org/data/2.5/weather?zip=${plz},de&APPID=${config_data.openweather}`
        }

        return axios(mainconfig)
            .then(async function(response) {
                var data = response.data
                var out = ({
                    place: `${data.name}, ${data.sys.country}`,
                    current_temp: (data.main.temp-273.15).toFixed(1),
                    temp_min: (data.main.temp_min-273.15).toFixed(1),
                    temp_max: (data.main.temp_max-273.15).toFixed(1),
                    current_humidity: data.main.humidity,
                    current_observation: data.weather[0].main,
                    current_wind: data.wind.speed,
                    lon: data.coord.lon,
                    lat: data.coord.lat
                })
                return out
            })
            .catch(function(error) {
                console.log(`[!wetter] ERR(1) ${error}`)
            })
}


module.exports = {
    plzWetter,
    stadtWetter
}