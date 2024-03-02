# Super Whatsapp Bot 

Multifunction Whatsapp Bot based on [pedroslopez whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)

## Requirements

- Chromium
```shell
apt install chromium-browser
```
- At least 2 GB RAM (puppeteer)
- Most functions require 3rd party APIs (MongoDB, OpenAI, Coinbase, OpenWeather) -> change config.js
- For yt: server.js + proxies + cookies + ffmpeg

## Installation

```shell
npm i
```

## Usage

```shell
npm start
```

To keep running:

```shell
npm install -g pm2
```

```shell
pm2 start index.js --name "swb" --cron-restart="0 3 * * *"
```

```shell
pm2 start server.js --name "swb_s" --cron-restart="0 3 * * *"
```

## Note

- Re-Auth 1-2 months
- ffmpeg additional libs
```shell
apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```