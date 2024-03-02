const axios = require("axios");
const cheerio = require("cheerio");
const config_data = require('../config.js');

async function ebay_first_page(item,tld) {
  found_prices = []
  try {
    item_no_space = item.replaceAll(" ","+")
    var imdb_config = {
        headers: {
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'accept-language': 'en-US,en;q=0.5',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
        },
        method: 'get',
        url: `https://www.ebay.${tld}/sch/i.html?_nkw=${item_no_space}`
    }  
    return axios(imdb_config)
        .then(async function(response) {
            const $ = cheerio.load(response.data)
            $('ul[class="srp-results srp-list clearfix"] li').each(function (i, element) {  
              let li_price = $(element).find('span[class="s-item__price"]').text().trim()
              if(!li_price == '') {
                price_comma_to_point = li_price.replace(',','.')
                formatted_price = Number(price_comma_to_point.replace(/[^0-9\.]+/g,""))
                found_prices.push(formatted_price)
              }           
            })  

            if(found_prices.length < 1) {
              $('ul[class="srp-results srp-grid clearfix"] li').each(function (i, element) {  
                  let li_price = $(element).find('span[class="s-item__price"]').text().trim()
                  if(!li_price == '') {
                    price_comma_to_point = li_price.replace(',','.')  
                    formatted_price = Number(price_comma_to_point.replace(/[^0-9\.]+/g,""))
                    found_prices.push(formatted_price)
                  }           
              })  
            }
            return found_prices
    })
  } catch (err) {
    console.error(err);
    return found_prices
  } 
}

async function ebay(item) {
  let ebay_tld = 'com'
  let ebay_currency = '$'
  
  if(config_data.lang == 'de') {
    ebay_tld = 'de'
    ebay_currency = '€'
  }
  res_obj = {}
  let ebay_res_prices = await ebay_first_page(item,ebay_tld)
  ebay_res_prices = ebay_res_prices.filter(value => /^-?\d+\.?\d*$/.test(value));

  if(ebay_res_prices.length < 1) {
    res_obj['status'] = 404
    res_obj['item'] = item
    return res_obj
  }
  let ebay_res_prices_average = ebay_res_prices.reduce((a, b) => a + b, 0) / ebay_res_prices.length

  res_obj['status'] = 200
  res_obj['item'] = item
  res_obj['min_price'] = Math.min(...ebay_res_prices).toString()
  res_obj['max_price'] = Math.max(...ebay_res_prices).toString()
  res_obj['avg_price'] = ebay_res_prices_average.toFixed(2)
  res_obj['tld'] = ebay_tld
  res_obj['currency'] = ebay_currency
  res_obj['url'] = `https://www.ebay.${ebay_tld}/sch/i.html?_nkw=${item_no_space}`

  return res_obj
}

module.exports = {
    ebay
}