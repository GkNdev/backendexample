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
  else if (channel === 'atv') {
    try {
      const response = await fetch('https://securevideotoken.tmgrup.com.tr/webtv/secure?468209&url=https%3A%2F%2Ftrkvz.daioncdn.net%2Fatv%2Fatv.m3u8%3Fce%3D3%26app%3Dd5eb593f-39d9-4b01-9cfd-4748e8332cf0', {
        headers: {
          Referer: "https://www.atv.com.tr/"
        }
      });
      const data = await response.json();
      res.redirect(data.Url)
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

