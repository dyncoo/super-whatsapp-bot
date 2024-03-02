const os = require('os')
const fs = require('fs')
const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const express = require('express');
const path = require('path')
const PORT = process.env.PORT || 3000

var networkInterfaces = os.networkInterfaces();
const host_ip = networkInterfaces['eth0'][0]['address']
host_address = `http://${host_ip}:3000`

let SID = `SID=cwj0tpDo7bPJSeTInJ8NQ01sP8RJAwNVb7OZWwvImZW4TzvWjLtxwIb9d8qXXXXXXXX_wQ.`
let SSID = `SSID=A-TpaAhCzXXXXXXXX`
let HSID = `HSID=AbHxFbpDgXXXXXXXX`
const COOKIE_DATA = SID + ';' + HSID + ';'  + SSID + ';'

const ID_TOKEN = `QUFFLUhqbFlHWE82ZEVYcm9ZYm5EbDNGcncyXXXXXXXXd3w\u003d` //not in cookies. find in your yt page source
const HttpsProxyAgent = require('https-proxy-agent')
const proxy_i = 7
const proxy_username = 'cozyXXXX';
const proxy_password = 'm3h1XXXXXXXX';
const authProxies_new = [
  '185.199.229.XXX:XXXX'
]

console.log(`host_address: ${host_address}`)
console.log(`using cookie: ${COOKIE_DATA}`)
console.log(`using proxy: ${authProxies_new[proxy_i]}`)

var server = express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.static(path.join(__dirname, 'media')))
  .get('/yt3/:ytid', async (req,res) => {
    var user = proxy_username
    var password = proxy_password
    var host = authProxies_new[proxy_i].split(':')[0]
    var port = authProxies_new[proxy_i].split(':')[1]
    var proxy = "http://" + user + ":" + password + "@" + host + ":" + port;
    var agent = HttpsProxyAgent(proxy);
    var ytid = req.params.ytid
    let path = `./media/temp_${ytid}.mp4`
    let path_mp3 = `./media/temp_${ytid}.mp3`
    var info = ""

    try {
      let { videoDetails : inf } = await ytdl
              .getInfo(ytid, {
                  quality: 'lowest',
                  requestOptions: {
                    agent,
                    headers: {
                      cookie: COOKIE_DATA,
                      'x-youtube-identity-token': ID_TOKEN
                    }
                  },
                })
                .then(console.log("[yt3] found!"))              
                .catch(error => {
                  console.log(error)
                  return 0
                })
      info = inf
      console.log(`[yt3] info: ${info}`)
      console.log(`[yt3] inf: ${inf}`)
      console.log(`[yt3] info.lengthSeconds: ${info.lengthSeconds}`)
      console.log(`[yt3] info.title: ${info.title}`)
      console.log(`[yt3] info.viewCount: ${info.viewCount}`)
      res.json({
          "yt_status" : 200,
          "yt_secs" : info.lengthSeconds,
          "yt_title" : info.title,
          "yt_viewCount" : info.viewCount
      })
    } catch (err) {
      console.log("[/yt3 info] ERRTEST ... " + err)
      res.json({
        "yt_status" : 400,
        "yt_secs" : 0,
        "yt_title" : 0,
        "yt_viewCount" : 0
      })
    }

    try {
        ytdl(ytid, {
        quality: '18',
        requestOptions: {
          agent,
          headers: {
            cookie: COOKIE_DATA,
            'x-youtube-identity-token': ID_TOKEN
          }
        },
        }).pipe(fs.createWriteStream(path))
          .on('error', (err) => {
              console.log(err, false)
              console.log("[/yt3] pipe.on error callback->"+err)
          })
          .on('finish', () => {
              proc = new ffmpeg({source:path})
                  .setFfmpegPath("/usr/bin/ffmpeg")
                  .toFormat('mp3')
                  .saveToFile(path_mp3) 
          })
      } catch (err) {
        console.log("[yt3] ytdl ERR ... " + err)
      }
  })
  .get('/yt4/:ytid', async (req,res) => {
      var user = proxy_username
      var password = proxy_password
      var host = authProxies_new[proxy_i].split(':')[0]
      var port = authProxies_new[proxy_i].split(':')[1]
      var proxy = "http://" + user + ":" + password + "@" + host + ":" + port
      var agent = HttpsProxyAgent(proxy)
      var ytid = req.params.ytid
      let path = `./media/temp_${ytid}.mp4`
      var info = ""

      try {
        let { videoDetails : inf } = await ytdl
                .getInfo(ytid, {
                    quality: 'lowest',
                    requestOptions: {
                      agent,
                      headers: {
                        cookie: COOKIE_DATA,
                        'x-youtube-identity-token': ID_TOKEN
                      }
                    },
                  })
                  .then(console.log("[yt4] found!"))              
                  .catch(error => {
                    console.log(error)
                    return 0
                  })
        info = inf
        console.log(`[yt4] info: ${info}`)
        console.log(`[yt4] inf: ${inf}`)
        console.log(`[yt4] info.lengthSeconds: ${info.lengthSeconds}`)
        console.log(`[yt4] info.title: ${info.title}`)
        console.log(`[yt4] info.viewCount: ${info.viewCount}`)
        res.json({
            "yt_status" : 200,
            "yt_secs" : info.lengthSeconds,
            "yt_title" : info.title,
            "yt_viewCount" : info.viewCount
        })
      } catch (err) {
        console.log("[/yt4] ERR ... " + err)
        res.json({
          "yt_status" : 400,
          "yt_secs" : 0,
          "yt_title" : 0,
          "yt_viewCount" : 0
        })
      }

      try {
          ytdl(ytid, {
          quality: '18',
          requestOptions: {
            agent,
            headers: {
              cookie: COOKIE_DATA,
              'x-youtube-identity-token': ID_TOKEN
            }
          },
          }).pipe(fs.createWriteStream(path))
            .on('error', (err) => {
                console.log("[/yt4] pipe.on error callback->"+err)
            })
            .on('finish', () => {
              console.log(`[/yt4] Youtube MP4 download finished! Sending ${ytid}.mp4 ...`)
            })
      } catch (err) {
          console.log("[/yt4] ERR ... " + err)
      }
  })
  .get('/yt4status/:ytid', async (req,res) => {
      var ytid = req.params.ytid
      let path = `./media/temp_${ytid}.mp4`
      if (fs.existsSync(path)) {
        res.json({
            "yt_status_dl" : 200,
            "yt_dl_link" : `${path}`
        })
      } else {
        res.json({
          "yt_status_dl" : 404,
          "yt_dl_link" : `${path}`
        })
      }
  })
  .listen(PORT, () => console.log(`EWB server listening on ${PORT}`))