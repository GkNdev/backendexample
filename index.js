const express = require("express");
const axios = require("axios");
const http = require("http");
const https = require("https");
const url = require("url");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Create axios instance with longer timeout
const client = axios.create({
  timeout: 30000,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

// Main endpoint to proxy the master m3u8 file
app.get("/stream", async (req, res) => {
  try {
    const sourceUrl = "https://vavoo.to/play/1536730627/index.m3u8";
    const response = await client.get(sourceUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      },
    });

    // Get the final URL after any redirects
    const finalUrl = response.request.res.responseUrl || sourceUrl;
    console.log("Final URL:", finalUrl);

    // Fetch the content from the final URL
    const m3u8Response = await client.get(finalUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      },
      responseType: "text",
    });

    // Modify the m3u8 content to point to our proxy for segment files
    const baseUrl = finalUrl.substring(0, finalUrl.lastIndexOf("/") + 1);
    let content = m3u8Response.data;

    // Replace all segment URLs with our proxy URLs
    content = content.replace(/^(.*\.ts.*)$/gm, (match) => {
      if (match.startsWith("#")) return match; // Skip comment/directive lines
      const segmentPath = match.trim();
      const fullSegmentUrl = new URL(segmentPath, baseUrl).toString();
      return `/segment?url=${encodeURIComponent(fullSegmentUrl)}`;
    });

    // Set proper headers for streaming
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-cache");
    res.send(content);
  } catch (error) {
    console.error("Error fetching stream:", error.message);
    res.status(500).send("Error fetching stream");
  }
});

// Endpoint to proxy segment files
app.get("/segment", async (req, res) => {
  try {
    const segmentUrl = req.query.url;
    if (!segmentUrl) {
      return res.status(400).send("Missing segment URL");
    }

    const response = await client.get(segmentUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      },
      responseType: "arraybuffer",
    });

    // Set proper headers for streaming segment files
    res.setHeader("Content-Type", "video/MP2T");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-cache");
    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error("Error fetching segment:", error.message);
    res.status(500).send("Error fetching segment");
  }
});

// HTML player sayfası
app.get("/", (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>M3U8 Player</title>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <style>
      body { margin: 0; background-color: #000; }
      #video { width: 100%; height: 100vh; }
    </style>
  </head>
  <body>
    <video id="video" controls autoplay></video>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const video = document.getElementById('video');
        const streamUrl = '/stream';
        
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
          video.addEventListener('loadedmetadata', function() {
            video.play();
          });
        }
      });
    </script>
  </body>
  </html>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the player at http://localhost:${PORT}/`);
  console.log(`Access the stream at http://localhost:${PORT}/stream`);
});
