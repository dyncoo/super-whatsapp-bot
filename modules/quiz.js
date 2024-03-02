const axios = require('axios')
const he = require('he')

async function quiz() {
    let mainconfig = {
        method: 'get',
        url: `https://opentdb.com/api.php?amount=1&difficulty=easy`
    }

    return axios(mainconfig)
        .then(async function(response) {
            let data = response.data
            let frage = data.results[0].question
            //unicode
            frage = he.decode(frage)
            let antwort = data.results[0].correct_answer
            //accents
            antwort = antwort.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            return { "frage" : frage, "antwort" : antwort }
        })
        .catch(function(error) {
            return console.log("[!quiz] error: " + error)
        })
}

module.exports = {
    quiz    
}