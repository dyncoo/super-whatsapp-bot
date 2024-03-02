const axios = require("axios");
const cheerio = require("cheerio");

async function imdb_find_titles(moviename) {
  found_titles = []
  try {
    moviename_no_space = moviename.replace(" ","+")
    var imdb_config = {
        headers: {
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'accept-language': 'en-US,en;q=0.5',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
          'host': 'www.imdb.com'
        },
        method: 'get',
        url: `https://www.imdb.com/find?q=${moviename_no_space}`
    }

    return axios(imdb_config)
        .then(async function(response) {
            const $ = cheerio.load(response.data)
            $('section[data-testid="find-results-section-title"] div[class="ipc-metadata-list-summary-item__c"]').each(function (i, element) {  
              const movieTitle = $(element).find('a[class="ipc-metadata-list-summary-item__t"]').text().trim()
              const movieHref = $(element).find('a[class="ipc-metadata-list-summary-item__t"]').attr('href')
  
              found_title = {
                name : movieTitle,
                href : movieHref
              };
  
              found_titles.push(found_title);
            });
            return found_titles
    })
  } catch (err) {
    console.error(err);
    return found_titles
  } 
}

async function imdb_info(url) {
  try {
    var imdb_config = {
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.5',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
        'host': 'www.imdb.com'
      },
      method: 'get',
      url: `https://www.imdb.com${url}`
    }

    return axios(imdb_config)
        .then(async function(response) {
            const $ = cheerio.load(response.data)
            let imdb_rating = $('div[data-testid="hero-rating-bar__aggregate-rating__score"] span').first().text().trim()
            let imdb_text = $('span[data-testid="plot-xs_to_m"]').text().trim()
            return {'rating' : imdb_rating,
                    'text' : imdb_text}
    })
  } catch (err) {
    console.error(err);
    return {'rating' : '',
            'text' : ''}
  } 
}

async function imdb(moviename) {
    res_obj = {}
    let imdb_res_titles = await imdb_find_titles(moviename)

    //movie title not found
    if(imdb_res_titles.length < 1) {
      res_obj['status'] = 404
      res_obj['title'] = moviename
      return res_obj
    }

    let imdb_res = await imdb_info(imdb_res_titles[0]['href'])
    res_obj['status'] = 200
    res_obj['title'] = imdb_res_titles[0]['name']
    res_obj['url'] = `https://www.imdb.com${imdb_res_titles[0]['href']}`
    res_obj['rating'] = imdb_res['rating']
    res_obj['text'] = imdb_res['text']
    return res_obj
}

module.exports = {
    imdb_find_titles,
    imdb_info,
    imdb
}