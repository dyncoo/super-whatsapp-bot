const qrcode = require('qrcode-terminal');

const { Client, LegacySessionAuth, Location, List, Buttons, LocalAuth, RemoteAuth } = require('whatsapp-web.js')
const { MessageMedia } = require('whatsapp-web.js')
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

const fs = require('fs')
const os = require('os')
const axios = require('axios')
const translate = require('@vitalets/google-translate-api')

const dbn = require('./modules/dbn')
const wetter = require('./modules/wetter')
const mgdb_m = require('./modules/mgdb')
const wiki = require('./modules/wiki')
const quiz = require('./modules/quiz')
const imdb = require('./modules/imdb')
const ebay = require('./modules/ebay')
const openai = require('./modules/openai')
const crypto = require('./modules/crypto')
const urban = require('./modules/urban')

const config_data = require('./config.js');

var networkInterfaces = os.networkInterfaces();
const host_ip = networkInterfaces['eth0'][0]['address']
host_address = `http://${host_ip}:3000`


console.log(`************************`)
console.log(`Language: ${config_data.lang}`)
console.log(`Currency: ${config_data.currency}`)
console.log(`host_address: ${host_address}`)
console.log(`************************`)

//language settings
const default_lang = 'en'
const valid_langs = ['af', 'ak', 'am', 'ar', 'as', 'ay', 'az', 'be', 'bg', 'bho', 'bm', 'bn', 'bs', 'ca', 'ceb', 'ckb', 'co', 'cs', 'cy', 'da', 'de', 'doi', 'dv', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fil', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gom', 'gu', 'ha', 'haw', 'he', 'hi', 'hmn', 'hr', 'ht', 'hu', 'hy', 'id', 'ig', 'ilo', 'is', 'it', 'iw', 'ja', 'jv', 'jw', 'ka', 'kk', 'km', 'kn', 'ko', 'kri', 'ku', 'ky', 'la', 'lb', 'lg', 'ln', 'lo', 'lt', 'lus', 'lv', 'mai', 'mg', 'mi', 'mk', 'ml', 'mn', 'mni-Mtei', 'mr', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'nso', 'ny', 'om', 'or', 'pa', 'pl', 'ps', 'pt', 'qu', 'ro', 'ru', 'rw', 'sa', 'sd', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tr', 'ts', 'tt', 'ug', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi', 'yo', 'zh', 'zh-CN', 'zh-TW', 'zu']

const user_dl_limit = 42

var quiz_active = false
var quiz_solution = ''
var quiz_answers = []

// Load the session data
mongoose.connect(config_data.mongodb).then(() => {
  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
      webVersionCache: {
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2411.2.html', //change to your whatsapp version
        type: 'remote' 
      },
      authStrategy: new RemoteAuth({
          store: store,
          backupSyncIntervalMs: 300000
      }),
      puppeteer: {
          executablePath: '/usr/bin/google-chrome-stable',
          headless: true,
          args: ['--no-sandbox','--disable-setuid-sandbox']
      }
  });

  client.initialize();  

  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
  });

  client.on('authenticated', () => {
    console.log('AUTHENTICATED');
  });

  client.on('auth_failure', message => {
    console.error('AUTHENTICATION FAILURE', message);
  });

  client.on('ready', () => {
    console.log('Super Whatsapp-Bot online!');
  });


  client.on('message', async message => {

    console.log('MESSAGE RECEIVED', message);

    let { t, notifyName, ack, isNewMsg } = message['_data']

    let { body, hasMedia, type, timestamp, from, to, author, deviceType, isForwarded, fromMe, hasQuotedMsg } = message

    if(!isNewMsg) {
      return;
    }
    
    var command = ''
    if(body.startsWith('@')) {
      command = body.trim().replace('@', '').split(/\s/).shift().toLowerCase()
    }  
    var arg
    if (hasQuotedMsg) {
      arg = message['_data']['quotedMsg']['body']
    } else {
      arg = body.split(' ').length > 1 ? body.trim().substring(body.indexOf(' ') + 1) : ''
    }

    console.log(`*************************`)
    console.log(`body: ${body}`)
    console.log(`command: ${command}`)
    console.log(`arg: ${arg}`)
    console.log(`*************************`)    
    console.log(`t: ${t}`)
    console.log(`notifyName: ${notifyName}`)
    console.log(`ack: ${ack}`)
    console.log(`isNewMsg: ${isNewMsg}`)
    console.log(`*************************`)
    console.log(`hasMedia: ${hasMedia}`)
    console.log(`type: ${type}`)
    console.log(`timestamp: ${timestamp}`)
    console.log(`from: ${from}`)
    console.log(`to: ${to}`)
    console.log(`author: ${author}`)
    console.log(`deviceType: ${deviceType}`)
    console.log(`isForwarded: ${isForwarded}`)
    console.log(`fromMe: ${fromMe}`)
    console.log(`hasQuotedMsg: ${hasQuotedMsg}`)
    console.log(`*************************`)

    if (message.body === 'Hi') {
        try {
            client.sendMessage(message.from, 'Hello! Bot online :)');
        } catch (err) {
            console.error(err)
        }
    }  

    if (command.startsWith('cmd') || command.startsWith('info') || command.startsWith('?')) {
      client.sendMessage(message.from, `Commands` 
      + `\n@translate`
      + `\n@wiki`
      + `\n@urban`
      + `\n@imdb`
      + `\n@ebay`
      + `\n@crypto`
      + `\n@chatgpt`
      + `\n@dalle`
      + `\n@wetter`
      + `\n@quiz`
      + `\n@casino`
      + `\n@ytmp3`
      + `\n@ytmp4`)
    }

    //chatgpt
    if (command.startsWith('openai') || command.startsWith('oai') || command.startsWith('ai') || command.startsWith('gpt') || command.startsWith('cgpt') || command.startsWith('chatgpt')) {

      if(arg <= 1) {
        return client.sendMessage(message.from, "Use chatgpt like this -> @gpt <question>")        
      }

      try {
        let res_openai_data = await openai.openai(arg)
        if(res_openai_data.status !== 200) {
          if (res_openai_data.status == 500) {
            return client.sendMessage(message.from, `Could not get response for OpenAI ChatGPT question '${arg}' (500)`) 
          }
          return client.sendMessage(message.from, "Error getting an OpenAI ChatGPT response") 
        }
        client.sendMessage(message.from, `OpenAI ChatGPT` 
          + `\n*'${res_openai_data.question}'*`
          + `\n${res_openai_data.answer.trim()}`)
      } catch(err){
        return client.sendMessage(message.from, `Error getting ChatGPT for '${arg}'`)
      }
    }

    //dall-e
    if (command.startsWith('dalle') || command.startsWith('aipicture') || command.startsWith('gptpicture')) {

      if(arg <= 1) {
        return client.sendMessage(message.from, "Use chatgpt like this -> @gpt <question>")        
      }

      try {
        let res_openai_data = await openai.openai_image(arg)
        if(res_openai_data.status !== 200) {
          if (res_openai_data.status == 500) {
            return client.sendMessage(message.from, `Could not get response for OpenAI ChatGPT question '${arg}' (500)`) 
          }
          return client.sendMessage(message.from, "Error getting an OpenAI ChatGPT response") 
        }
        let media = await MessageMedia.fromUrl(res_openai_data.answer);
        client.sendMessage(message.from, media);
      } catch(err){
        return client.sendMessage(message.from, `Error getting ChatGPT for '${arg}'`)
      }
    }

    //imdb
    if (command.startsWith('imdb') || command.startsWith('i') || command.startsWith('movie')) {

      if(arg <= 1) {
        return client.sendMessage(message.from, "Use IMDb like this -> @imdb <movie title>")        
      }

      try {
        let res_imdb_data = await imdb.imdb(arg)
        if(res_imdb_data.status !== 200) {
          if (res_imdb_data.status == 404) {
            return client.sendMessage(message.from, `Movie/Series '${arg}' not found on IMDb (404)`) 
          }
          return client.sendMessage(message.from, "Use IMDb like this -> @imdb <movie title>") 
        }

        client.sendMessage(message.from, `IMDb` 
        + `\n*${res_imdb_data.title}* (${res_imdb_data.rating})`
        + `\n${res_imdb_data.text}`
        + `\n${res_imdb_data.url}`)
      } catch(err){
        return client.sendMessage(message.from, `Error getting IMDb for '${arg}'`)
      }
    }

    //ebay
    if (command.startsWith('ebay') || command.startsWith('e') || command.startsWith('price')) {

      if(arg <= 1) {
        return client.sendMessage(message.from, "Use eBay like this -> @ebay <item>")
      }

      try {
        let res_ebay_data = await ebay.ebay(arg)        
        if(res_ebay_data.status !== 200) {
          if (res_ebay_data.status == 404) {
            return client.sendMessage(message.from, `Item '${arg}' not found on eBay (404)`) 
          }
          return client.sendMessage(message.from, "Use ebay like this -> @ebay <item>") 
        }

        client.sendMessage(message.from, `*eBay(.${res_ebay_data.tld})* result *'${res_ebay_data.item}'*` 
        + `\nAverage: *${res_ebay_data.avg_price}${res_ebay_data.currency}*`
        + `\nLowest: ${res_ebay_data.min_price}${res_ebay_data.currency}`
        + `\nHighest: ${res_ebay_data.max_price}${res_ebay_data.currency}`        
        + `\n${res_ebay_data.url}`)
      } catch(err){
        console.log("[@ebay] try catch ERR..." + err);
        return client.sendMessage(message.from, `Error getting eBay for '${arg}'`)
      }
    }

    //urban
    if (command.startsWith('urban') || command.startsWith('u') || command.startsWith('define') || command.startsWith('definition')) {

      if(arg <= 1) {
        return client.sendMessage(message.from, "Use urban dictionary definition like this -> @urban <term>")        
      }

      try {
        let res_urban_data = await urban.urban(arg)
        if(res_urban_data.defs.length > 1) {  
          client.sendMessage(message.from, `*Urban Dictionary* result(s) *'${res_urban_data.term}'*` 
          + `\n1. ${res_urban_data.defs[0]['definition']}`
          + `\n2. ${res_urban_data.defs[1]['definition']}`
          + `\n${res_urban_data.url}`)
        } else {  
          client.sendMessage(message.from, `*Urban Dictionary* result *'${res_urban_data.term}'*` 
          + `\n1. ${res_urban_data.defs[0]['definition']}`
          + `\n${res_urban_data.url}`)
        }
      } catch(err){
        console.log("[@urban] try catch ERR..." + err);
        return client.sendMessage(message.from, `Error connecting to Urban Dictionary for '${arg}'`)
      }
    }

    //crypto
    if (command.startsWith('crypto') || command.match('cc')) {

      try {  
        let res_crypto_data = await crypto.getAllCrypto(arg)
        res_str = ''
        for (const [key, value] of Object.entries(res_crypto_data)) {
            res_str += "*" + key + "*: " + value + "\n"
          }
        client.sendMessage(message.from, `crypto (buy price)\n` 
        + res_str)    
      } catch(err){
        console.log("@crypto]  try catch ERR..." + err);
        return client.sendMessage(message.from, `Error getting current crypto price`)
      }
    }

    //weather (API only works for german cities)
    if (command.startsWith('wetter')) {
      const zahl = /^[0-9]./
      const buchstabe = /^[a-zA-Z]./
      if (arg.match(zahl)) {
        var data = await wetter.plzWetter(arg)
      } else if (arg.match(buchstabe)) {
        var data = await wetter.stadtWetter(arg)
      } else {
        client.sendMessage(message.from, 'Stadt ' + arg + ' nicht gefunden');
      }
      if (data == "error") {
          client.sendMessage(message.from, `Stadt/PLZ '${arg}' nicht gefunden!`)
      } else {
          var bedingungen
          await translate(data.current_observation, {to: default_lang}).then(res => {
                bedingungen = res.text
          }).catch(err => {
              client.sendMessage(message.from, `wetter translate err ${err}`);
              console.error("@wetter translate err: " + err);
          });
          client.sendMessage(message.from, `*Wetter für ${data.place}*\n` 
                                      + "\n*Temp:* "+ data.current_temp + " °C"  
                                      + "\n*Bedingungen:* "+ bedingungen
                                      + "\n*Min Temp:* " + data.temp_min + " °C"
                                      + "\n*Max Temp:* " + data.temp_max + " °C"
                                      + "\n*Luftfeuchtigkeit:* " + data.current_humidity + "%" 
                                      + "\n*Windstärke:* " + data.current_wind);
      }
    }

    //translate
    if (command.startsWith('t')) {
        if(hasQuotedMsg) {
          quoted_message = message['_data']['quotedMsg']['body']
          message.body = `${message.body} ${quoted_message}`
        }
        let translate_msg_arr = message.body.split(" ")
        if(translate_msg_arr.length <= 1) {
          return client.sendMessage(message.from, "Use translate like this -> @t <from-language> <to-language> <text>")          
        } else if(translate_msg_arr.length > 1 && translate_msg_arr.length <= 2) {
          if(!valid_langs.includes(translate_msg_arr[1])) {
            req_text = translate_msg_arr[1]
            translate(req_text, {to: default_lang}).then(res => {
                  client.sendMessage(message.from, res.text)
              }).catch(err => {
                  client.sendMessage(message.from, "Error translating")
              });
          } else if(valid_langs.includes(translate_msg_arr[1])) {
            return client.sendMessage(message.from, `(1)Please enter text to translate to ${translate_msg_arr[1]}. \n\nUse translate like this -> \n@t (<from-language> <to-language>) <text>`)
          } else {
            return client.sendMessage(message.from, `Error(1) translating. Check @cmds`)
          }
        } else if(translate_msg_arr.length > 2 && translate_msg_arr.length <= 3) {              
          if(!valid_langs.includes(translate_msg_arr[1])) {
            let translate_msg_split = translate_msg_arr.splice(1)
            req_text = translate_msg_split.join(' ')
            translate(req_text, {to: default_lang}).then(res => {
                  client.sendMessage(message.from, res.text)
              }).catch(err => {
                  client.sendMessage(message.from, "Error(2) translating. Check @cmds")
              });
          }
          if(valid_langs.includes(translate_msg_arr[1])) {
            if(valid_langs.includes(translate_msg_arr[2])) {
              return client.sendMessage(message.from, `(2)Please enter text to translate from ${translate_msg_arr[1]} to ${translate_msg_arr[2]}. \n\nUse translate like this -> \n@tr (<from-language> <to-language>) <text>`)
            } else {
              if(translate_msg_arr[1] == default_lang) {
                translate_msg_split = translate_msg_arr.splice(2)
                req_text = translate_msg_split.join(' ')
                translate(req_text, {to: translate_msg_arr[1]}).then(res => {
                    client.sendMessage(message.from, res.text)
                }).catch(err => {
                    client.sendMessage(message.from, "Error(3) translating. Check @cmds")
                });  
              } else {
                translate_msg_split = translate_msg_arr.splice(2)
                req_text = translate_msg_split.join(' ')
                translate(req_text, {to: translate_msg_arr[1]}).then(res => {
                    client.sendMessage(message.from, res.text)
                }).catch(err => {
                    client.sendMessage(message.from, "Error(4) translating. Check @cmds")
                });
              }
            }
          } else {
            client.sendMessage(message.from, `Translating in default language (${default_lang})`)
            translate_msg_split = translate_msg_arr.splice(1)
            req_text = translate_msg_split.join(' ')
            translate(req_text, {to: default_lang}).then(res => {
                  client.sendMessage(message.from, res.text)
              }).catch(err => {
                  client.sendMessage(message.from, "Error(5) translating. Check @cmds")
              });
          }
        }                    
        else if(translate_msg_arr.length > 3) {
          if(valid_langs.includes(translate_msg_arr[1])) {
            if(valid_langs.includes(translate_msg_arr[2])) {
              translate_msg_split = translate_msg_arr.splice(3)
              req_text = translate_msg_split.join(' ')
              translate(req_text, {from: translate_msg_arr[1], to: translate_msg_arr[2]}).then(res => {
                  client.sendMessage(message.from, res.text)
              }).catch(err => {
                  client.sendMessage(message.from, "Error(6) translating. Check @cmds")
              });
            } else {  
                if(translate_msg_arr[1] == default_lang) { 
                  translate_msg_split = translate_msg_arr.splice(2)
                  req_text = translate_msg_split.join(' ')
                  translate(req_text, {to: translate_msg_arr[1]}).then(res => {
                      client.sendMessage(message.from, res.text)
                  }).catch(err => {
                      client.sendMessage(message.from, "Error(7) translating. Check @cmds")
                  });  
                } else {
                  translate_msg_split = translate_msg_arr.splice(2)
                  req_text = translate_msg_split.join(' ')
                  translate(req_text, {to: translate_msg_arr[2]}).then(res => {
                      client.sendMessage(message.from, res.text)
                  }).catch(err => {
                      client.sendMessage(message.from, "Error(8) translating. Check @cmds")
                  });
                }
            }              
          } else {
            translate_msg_split = translate_msg_arr.splice(1)                
            req_text = translate_msg_split.join(' ')
            translate(req_text, {to: default_lang}).then(res => {
                client.sendMessage(message.from, res.text)
            }).catch(err => {
                client.sendMessage(message.from, "Error(9) translating. Check @cmds")
            });
          }
        } else {
          client.sendMessage(message.from, "Error(10) translating. Check @cmds")
        }
    }

    if(quiz_active) {
      try {
        let new_answer = {}
        new_answer['answer'] = body 
        new_answer['from'] = from
        new_answer['notifyName'] = notifyName
        new_answer['author'] = author
        new_answer['correct'] = false
        new_answer['subcorrect'] = false
        if(!quiz_answers.some(item => item['author'] == new_answer['author'])) {
          if(body == quiz_solution || body.toLowerCase() == quiz_solution.toLowerCase()) {
            new_answer['correct'] = true
          }
          if(!new_answer['correct'] && quiz_solution_arr.includes(body.toLowerCase()) && body.toLowerCase() !== '') {
            new_answer['subcorrect'] = true
          }
          quiz_answers.push(new_answer)
        }
      } catch(err) {
        console.log(`[@quiz] Couldn't add quiz answer ${body}`)
        console.log(err)
      }
    }

    //quiz
    if (command.startsWith('quiz') || command.startsWith('q')) {

      var data = await quiz.quiz()
      quiz_solution = data.antwort
      quiz_solution_arr = data.antwort.toLowerCase().split(" ")
      client.sendMessage(message.from, `*Quiz*\n${data.frage}`)  
      quiz_active = true
      await new Promise(resolve => setTimeout(resolve, 30000))
      client.sendMessage(message.from, `*Quiz solution*\n${data.antwort}`)

      for(let qi = 0;qi < quiz_answers.length;qi++) {
        if(quiz_answers[qi]['correct']) {
          liegestuetzen = 20
          mgdb_m.mgdb(author,liegestuetzen)
              .then(id_obj => {
                var lsjz = parseInt(id_obj.liegestuetzen) + 20
                client.sendMessage(message.from, `${notifyName} is correct +20 points! total: ${lsjz}`)
              })
              .catch(err => {
                console.log("[@quiz] err(1):" + err)
              })   
        }
        if(quiz_answers[qi]['subcorrect']) {
          liegestuetzen = 5
          mgdb_m.mgdb(author,liegestuetzen)
              .then(id_obj => {
                var lsjz = parseInt(id_obj.liegestuetzen) + 5
                client.sendMessage(message.from, `${notifyName} is partly correct +5 points! ${notifyName}'s total: ${lsjz}`)
              })
              .catch(err => {
                console.log("[@quiz] err(2):" + err)
              })   
        }
      }
      quiz_active = false 
      quiz_answers = []
    }

    //casino
    if (command.startsWith('casino') || command.startsWith('gamble') ) {    
      var fruitArr = ['🍉','🍇','🍒','🍊','🍋','🥥','🌶']
      var winArr = []
      var winString = ""
      var liegestuetzen = 0
      for(i=1;i<=3;i++) {
        var n = Math.floor(Math.random()*fruitArr.length)
        winArr.push(n)
        if(i<3) {
          winString += `|${fruitArr[n]}`
        } else {
          winString += `|${fruitArr[n]}|`              
        }
      }  
      if(winArr[0] == winArr[1] && winArr[0] !== winArr[2]) {
        liegestuetzen = 20
        mgdb_m.mgdb(author,liegestuetzen)
            .then(id_obj => {
              var lsjz = parseInt(id_obj.liegestuetzen) + 20
              client.sendMessage(message.from, `${winString} \n+20 points!\n${notifyName}'s total: ${lsjz}`) 
            })
            .catch(err => {
              console.log("[@casino] err(1):" + err)
            })              
      } else if (winArr[0] == winArr[1] && winArr[0] == winArr[2]) { 
          liegestuetzen = 50
          mgdb_m.mgdb(author,liegestuetzen)
            .then(id_obj => {
              var lsjz = parseInt(id_obj.liegestuetzen) + 50
              client.sendMessage(message.from, `${winString} \n+50 points!\n${notifyName}'s total: ${lsjz}`) 
            })
            .catch(err => {
              console.log("[@casino] err(2):" + err)
            }) 
      } else {
          liegestuetzen = -5
          mgdb_m.mgdb(author,liegestuetzen)
            .then(id_obj => {
              var lsjz = parseInt(id_obj.liegestuetzen) - 5
              client.sendMessage(message.from, `${winString} \n-5 points!\n${notifyName}'s total: ${lsjz}`) 
            })
            .catch(err => {
              console.log("[@casino] err(3):" + err)
            })  
      }
    }

    if (command.startsWith('reset ls')) {
        if (hasQuotedMsg) {
          user_to_reset = message.to
        }
        var user_to_reset = arg.split("ls ")[1]        
        mgdb_m.mgdb_del(user_to_reset)
        .then(id_obj => {
          client.sendMessage(message.from, `${user_to_reset}s points deleted`) 
        })
        .catch(err => {
          console.log("[@reset ls] err:" + err)
        })
    }
    if (command.startsWith('set ls')) {
        var name_ls_string = arg.split("ls ")[1]
        var username = name_ls_string.split(" ")[0]
        var ls = name_ls_string.split(" ")[1]        
        mgdb_m.mgdb_set(username,ls)
        .then(id_obj => {
          client.sendMessage(message.from, `${username}s points set to ${ls}`) 
        })
        .catch(err => {
          console.log("[@set ls] err:" + err)
        })
    }

    //wiki
    if (command.startsWith('wiki')) {
      let wiki_result = await wiki.wiki(arg)
      var umla = { 'ä' : '%C3%A4',
            'Ä' : '%C3%84',
            'ö' : '%C3%B6',
            'Ö' : '%C3%96',
            'ü' : '%C3%BC',
            'Ü' : '%C3%9C',
            'ß' : '%C3%9F'}
      let linkarg = arg.replace(/[äÄöÖüÜß]/g, u => umla[u])
      linkarg = linkarg.replace(' ','%20')
      client.sendMessage(message.from, `*Wikipedia* result *'${arg}'*` 
                                      + '\n' + wiki_result + '...'
                                      + `\nhttps://${config_data.lang}.wikipedia.org/wiki/${linkarg}`)
    }

    //ytmp3
    if(command.startsWith('ytmp3') || command.startsWith('mp3') ) {
      try {
        var ytid
        if(hasQuotedMsg) {
          message.body = arg
        }
          
        if(message.body.includes('youtu.be/')){
          ytid = message.body.split('youtu.be/')[1]
          if(ytid.includes('&')) {
            ytid = ytid.split('&')[0]
          }
        } else if(message.body.includes('youtube.com/watch?v=')){
          ytid = message.body.split('youtube.com/watch?v=')[1]
          if(ytid.includes('&')) {
            ytid = ytid.split('&')[0]
          }
        } else {
          return client.sendMessage(message.from, `Youtube-Link '${message.body}' not valid`)
        }

        var username_number = message.from.split('-')[0].toString()
        var yt_anz

        await mgdb_m.ytdb(username)
        .then(id_obj => {
          yt_anz = id_obj.yt
        })
        .catch(err => {
          console.log("[@ytmp3] err(1):" + err)
          return client.sendMessage(message.from, `DB connection error`) 
        })

        if(yt_anz >= user_dl_limit) {
            return client.sendMessage(message.from, `Max 3 vids/hour`) 
        }

        var yt_status
        var yt_secs
        var yt_title
        var yt_viewCount

        var getWait = {
            method: 'get',
            url: `${host_address}/yt3/${ytid}`
        }
        
        await axios(getWait)
              .then(async function(response) {
                  var data = response.data
                  yt_status = data.yt_status
                  yt_secs = data.yt_secs
                  yt_title = data.yt_title
                  yt_viewCount = data.yt_viewCount
              })
              .catch(err => {
                yt_status = 400
              })
        if(yt_status == 400) {
          return client.sendMessage(message.from, `*YTMP3 error: couldn't get video info*` 
                                                + `\ninvalid youtube url or cookies/proxy error`)
        }

        if(yt_secs > 600) {
          await mgdb_m.ytdb_err(username)
          .then(id_obj => {
            yt_anz = id_obj.yt
          })
          .catch(err => {
            console.log("[@ytmp3] Limit 10 min ERR err:" + err)
          })
          return client.sendMessage(message.from, 'Error! Video cant exceed 10 min');
        }

        var wz = Math.round(yt_secs/30) + 1
        var wartezeit = Math.round((wz*20)/60)
        var length = Math.round(yt_secs/60*100)/100
        client.sendMessage(message.from, `*YTMP3 video found!*` 
                                      + `\nTitel: '${yt_title}'`
                                      + `\nViews: ${yt_viewCount}`
                                      + `\nLength: ${length} min`
                                      + `\n\nPlease wait approx ${wartezeit} min ...`)

        //to fix: replace with ffmpeg finished converting promise
        for(mp3_i=1;mp3_i<=wz;mp3_i++){
          await new Promise(resolve => setTimeout(resolve, 20000))
        }  
        try {
          let media = await MessageMedia.fromUrl(`${host_address}/temp_${ytid}.mp3`);
          client.sendMessage(message.from, media);
        } catch (err) {
            console.error(err)
        }  
      } catch(err) {
        console.log(`err: `, err)
        return client.sendMessage(message.from, `Error! Couldn't download MP3`)
      }
    }

    //ytmp4
    if (command.startsWith('ytmp4') || command.startsWith('mp4')) {    
      try {        
        var ytid 
        
        if(hasQuotedMsg) {
          message.body = arg
        }

        if(message.body.includes('youtu.be/')){
          ytid = message.body.split('youtu.be/')[1]
          if(ytid.includes('&')) {
            ytid = ytid.split('&')[0]
          }
        } else if(message.body.includes('youtube.com/watch?v=')){
          ytid = message.body.split('youtube.com/watch?v=')[1]
          if(ytid.includes('&')) {
            ytid = ytid.split('&')[0]
          }
        } else {
          return client.sendMessage(message.from, `Youtube-Link '${message.body}' not valid`)
        }    
        var username_number = message.from.split('-')[0].toString()
        var yt_anz

        await mgdb_m.ytdb(username_number)
        .then(id_obj => {
          yt_anz = id_obj.yt
        })
        .catch(err => {
          console.log("[@ytmp4] err(1):" + err)
          return client.sendMessage(message.from, `[@ytmp4] DB connection error`) 
        })

        if(yt_anz >= user_dl_limit) {
            return client.sendMessage(message.from, `Max 3 vids/hour`) 
        }

        var yt_status
        var yt_secs
        var yt_title
        var yt_viewCount

        var getWait = {
            method: 'get',
            url: `${host_address}/yt4/${ytid}`
        }

        await axios(getWait)
              .then(async function(response) {
                  var data = response.data
                  yt_status = data.yt_status
                  yt_secs = data.yt_secs
                  yt_title = data.yt_title
                  yt_viewCount = data.yt_viewCount
              })
              .catch(err => {
                console.log(`[@${command}] getWait err: ${err}`)
              })

        if(yt_status == 400) {
          return         client.sendMessage(message.from, `*YTMP4 error: couldn't get video info*` 
                                                          + `\ninvalid youtube url or cookies/proxy error`)
        }

        if(yt_secs > 600) {
          await mgdb_m.ytdb_err(username)
          .then(id_obj => {
            yt_anz = id_obj.yt
          })
          .catch(err => {
            console.log("[@ytmp4] Über 10 min ERR err:" + err)
          })
          return client.sendMessage(message.from, 'Error! Video exceeds 10 min length');
        }

        var wz = Math.round(yt_secs/40) + 1  
        var wartezeit = Math.round((wz*20)/60)
        var length = Math.round(yt_secs/60*100)/100
        client.sendMessage(message.from, `*YTMP4 video found!*` 
                                      + `\nTitel: '${yt_title}'`
                                      + `\nViews: ${yt_viewCount}`
                                      + `\nLength: ${length} min`
                                      + `\n\nPlease wait approx ${wartezeit} min ...`)

        for(mp4_i=1;mp4_i<=wz;mp4_i++){
          await new Promise(resolve => setTimeout(resolve, 20000))
        }

        try {
          let media = await MessageMedia.fromUrl(`${host_address}/temp_${ytid}.mp4`);
          client.sendMessage(message.from, media);
        } catch (err) {
            console.error(err)
        }         
      } catch(err) {
        return client.sendMessage(message.from, `Error! Couldn't download MP4`)
      }
    }
  });
});
console.log(`client inited!`)
