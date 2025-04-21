const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  const response = await fetch('https://www.nowtv.com.tr/canli-yayin');
  const html = await response.text();
  const lines = html.split('\n');
  const hlsLine = lines.find(line => line.includes('daiUrl'));

  if (hlsLine) {
    const match = hlsLine.match(/daiUrl : '([^"]+)'/);
    console.log(match)
    if (match) {
      console.log(match[1])
      const hlsUrl = match[1];
      res.redirect(hlsUrl);
    } else {
      res.status(404).json({ error: 'HLS URL Bulunamadı , goflex telegramdan admine bildirebilirsiniz.' });
    }
  } else {
    res.status(404).json({ error: 'HLS URL Bulunamadı , goflex telegramdan admine bildirebilirsiniz.' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
