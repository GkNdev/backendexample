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
  else {
    res.status(404).json({ error: 'Kanal Bulunamadı , goflex telegramdan admine bildirebilirsiniz.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

