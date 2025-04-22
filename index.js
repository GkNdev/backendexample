const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/gkn/:channel', async (req, res) => {
  const channel = req.params.channel;

  if (channel === 'nowtv') {
    const response = await fetch('https://www.nowtv.com.tr/canli-yayin');
    const html = await response.text();
    const lines = html.split('\n');
    const hlsLine = lines.find(line => line.includes('daiUrl'));

    if (hlsLine) {
      const match = hlsLine.match(/daiUrl : '([^"]+)'/);
      if (match) {
        const hlsUrl = match[1];
        res.redirect(hlsUrl);
      } else {
        res.status(404).json({ error: 'HLS URL Bulunamadı , goflex telegramdan admine bildirebilirsiniz.' });
      }
    } else {
      res.status(404).json({ error: 'HLS URL Bulunamadı , goflex telegramdan admine bildirebilirsiniz.' });
    }
  }
  else if (channel === 'ahaber') {
    try {
      const response = await fetch('https://securevideotoken.tmgrup.com.tr/webtv/secure?29752&url=https%3A%2F%2Ftrkvz-live.ercdn.net%2Fahaberhd%2Fahaberhd.m3u8&url2=https%3A%2F%2Ftrkvz-live.ercdn.net%2Fahaberhd%2Fahaberhd.m3u8', {
        headers: {
          Referer: "https://www.ahaber.com.tr/video/canli-yayin",
          "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36"
        }
      });
      const data = await response.json();
      console.log(data.AlternateUrl);
      res.redirect(data.AlternateUrl);
    } catch (error) {
      res.send("Bir hata oluştu", error);
    }
  }
  else {
    res.status(404).json({ error: 'Kanal Bulunamadı , goflex/gkn telegramdan admine bildirebilirsiniz.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

