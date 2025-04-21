const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Stream Player</title>
            <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
        </head>
        <body>
            <video id="video" controls style="width: 100%; max-width: 800px;"></video>
            <script>
                var video = document.getElementById('video');
                var videoSrc = '/stream';
                if(Hls.isSupported()) {
                    var hls = new Hls();
                    hls.loadSource(videoSrc);
                    hls.attachMedia(video);
                }
                else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = videoSrc;
                }
            </script>
        </body>
        </html>
    `);
});

// Stream endpoint
app.get('/stream', async (req, res) => {
    try {
        const response = await fetch('https://ppp.mevzuhls32.cfd/yayinzirve.m3u8', {
            headers: {
                "referer": "https://grtv32.live/"
            }
        });

        if (!response.ok) {
            throw new Error('Stream not available');
        }

        const m3u8Content = await response.text();

        // Set appropriate headers
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Access-Control-Allow-Origin', '*');

        res.send(m3u8Content);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching stream');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
