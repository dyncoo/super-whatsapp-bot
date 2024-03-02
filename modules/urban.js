const axios = require('axios');

async function urban(term) {

    var umla = { 'ä' : '%C3%A4',
                 'Ä' : '%C3%84',
                 'ö' : '%C3%B6',
                 'Ö' : '%C3%96',
                 'ü' : '%C3%BC',
                 'Ü' : '%C3%9C',
                 'ß' : '%C3%9F'}

    term = term.replace(/[äÄöÖüÜß]/g, u => umla[u])
    term = term.replace(' ','%20')

    var mainconfig = {
        method: 'get',
        url: `https://api.urbandictionary.com/v0/define?term=${term}`
    }

    let urban_res_obj = {}

    return axios(mainconfig)
        .then(async function(response) {            
            let data = response.data
            try {
                for(u_def_i in data['list']) {
                    data['list'][u_def_i]['definition'] = data['list'][u_def_i]['definition'].replace(/[\[\]']+/g,'')
                }
            } catch (urban_replace_err) {
                console.log('[!urban] urban_replace_err: ' + urban_replace_err)
            }
            urban_res_obj['status'] = 200
            urban_res_obj['term'] = term
            urban_res_obj['defs'] = data['list']
            urban_res_obj['url'] = `https://www.urbandictionary.com/define.php?term=${term}`

            return urban_res_obj
        })
        .catch(function(error) {
            urban_res_obj['status'] = 404
            urban_res_obj['term'] = term
            urban_res_obj['defs'] = [`No definition found for '${term}'`]
            urban_res_obj['url'] = `https://www.urbandictionary.com/define.php?term=${term}`

            console.log('[!urban] error: ' + error)
            return urban_res_obj
        })
}


module.exports = {
    urban    
}