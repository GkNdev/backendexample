const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require("http");
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", async (req, res) => {
  const targetUrl = "https://vavoo.to/play/1536730627/index.m3u8";

  const options = {
    headers: {
      "User-Agent": "VAVOO/1.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://vavoo.to/",
    },
    timeout: 30000, // 30 seconds timeout
  };

  console.log(`Requesting: ${targetUrl}`);

  const request = https.get(targetUrl, options, (response) => {
    console.log(`Status Code: ${response.statusCode}`);
    console.log(`Headers: ${JSON.stringify(response.headers)}`);

    // Handle redirects
    if (
      response.statusCode >= 300 &&
      response.statusCode < 400 &&
      response.headers.location
    ) {
      console.log(`Redirecting to: ${response.headers.location}`);
      return res.redirect(response.headers.url);
    }

    // Forward status code
    res.status(response.statusCode);

    // Forward headers
    for (const [key, value] of Object.entries(response.headers)) {
      res.setHeader(key, value);
    }

    // Pipe the response directly to the client
    response.pipe(res);

    response.on("error", (err) => {
      console.error("Response error:", err.message);
      if (!res.headersSent) {
        res.status(500).send(`Error in stream: ${err.message}`);
      }
    });
  });

  request.on("error", (err) => {
    console.error("Request error:", err.message);
    if (!res.headersSent) {
      res.status(500).send(`Error making request: ${err.message}`);
    }
  });

  request.on("timeout", () => {
    console.error("Request timed out");
    request.destroy();
    if (!res.headersSent) {
      res.status(504).send("Request timed out");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
