const axios = require('axios')
const config_data = require('../config.js');
API_KEY = config_data.openai

async function openai(question) {
    res_obj = {}

    try {        
        const client = axios.create({
            headers: {
            'Authorization': 'Bearer ' + API_KEY
            }
        });

        let params = {
            "model": "gpt-3.5-turbo-instruct",
            "prompt": question,
            "temperature": 0.9,
            "max_tokens": 450,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0.6,
            "stop": [" Human:", " AI:"]
        }

        await client.post('https://api.openai.com/v1/completions',params)
            .then(result => {
                res_obj['status'] = 200
                res_obj['question'] = question
                res_obj['answer'] = result.data.choices[0].text                
            })
            .catch(err => {
                console.log(err)
                res_obj['status'] = 500
                res_obj['question'] = question
                res_obj['answer'] = ''
            })

        return res_obj

    } catch (err) {
        console.error(err);
        res_obj['status'] = 500
        res_obj['question'] = question
        res_obj['answer'] = ''
        return res_obj
    } 
}

async function openai_image(question) {
    res_obj = {}

    try {        
        const client = axios.create({
            headers: {
            'Authorization': 'Bearer ' + API_KEY
            }
        });

        let params = {
            model: "dall-e-2",
            prompt: question,
            n: 1,
            size: "1024x1024"
        }

        await client.post('https://api.openai.com/v1/images/generations',params)
            .then(result => {
                console.log("result.data")
                console.log(result.data)
                res_obj['status'] = 200
                res_obj['question'] = question
                res_obj['answer'] = result.data.data[0].url                
            })
            .catch(err => {
                console.log("err")
                console.log(err)
                res_obj['status'] = 500
                res_obj['question'] = question
                res_obj['answer'] = ''
            })
        return res_obj

    } catch (err) {
        console.error(err);
        res_obj['status'] = 500
        res_obj['question'] = question
        res_obj['answer'] = ''
        return res_obj
    } 
}


module.exports = {
    openai,
    openai_image
}
