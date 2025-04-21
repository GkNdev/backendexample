const express = require('express');
const app = express();
const puppeteer = require('puppeteer');

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
  } else if (channel === "sozcu") {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set headers
      await page.setExtraHTTPHeaders({
        "Referer": "https://www.ecanlitvizle.app/"
      });

      await page.goto('https://www.ecanlitvizle.app/embed.php?kanal=szc-tv-sozcu-televizyonu-canli-izle');

      await page.evaluate(() => {
        const element = document.querySelector(".jw-icon-display");
        if (element) {
          element.click();
        }
      });

      let foundStream = false;
      await page.setRequestInterception(true);

      page.on('request', request => {
        const url = request.url();
        if (url.includes('.m3u8?tkn=') && !foundStream) {
          foundStream = true;
          res.redirect(url);
          browser.close();
        }
        request.continue();
      });

      // Set a timeout to close browser and return error if no stream URL is found
      setTimeout(async () => {
        if (!foundStream) {
          await browser.close();
          if (!res.headersSent) {
            res.status(404).json({ error: 'HLS URL Bulunamadı , goflex telegramdan admine bildirebilirsiniz.' });
          }
        }
      }, 10000);
    } catch (error) {
      console.error('Error handling Sozcu TV:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.' });
      }
    }
  }
  else {
    res.status(404).json({ error: 'Kanal Bulunamadı , goflex telegramdan admine bildirebilirsiniz.' });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
