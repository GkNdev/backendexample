const express = require("express");
const cors = require("cors");
const https = require("https");
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

  // This function returns a Promise that resolves with the final URL after any redirects
  const getStreamUrl = () => {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          "User-Agent": "VAVOO/1.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://vavoo.to/",
        },
        timeout: 2000, // 30 seconds timeout
      };

      console.log(`Requesting: ${targetUrl}`);

      const request = https.get(targetUrl, options, (response) => {
        console.log(`Status Code: ${response.statusCode}`);
        console.log(`Headers: ${JSON.stringify(response.headers)}`);

        // If there's a redirect, follow it
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          console.log(`Redirect location found: ${response.headers.location}`);
          resolve(response.headers.location);
          return;
        }

        // If no redirect but successful response, resolve with the original URL
        // This is what you want - the URL that works for the actual stream
        if (response.statusCode >= 200 && response.statusCode < 300) {
          console.log(`Successfully connected to stream at: ${targetUrl}`);
          resolve(targetUrl);
          return;
        }

        // Otherwise reject with error
        reject(new Error(`Unexpected status code: ${response.statusCode}`));
      });

      request.on("error", (err) => {
        console.error("Request error:", err.message);
        reject(err);
      });

      request.on("timeout", () => {
        console.error("Request timed out");
        request.destroy();
        reject(new Error("Request timed out"));
      });
    });
  };

  try {
    // Get the URL and redirect the user
    const finalUrl = await getStreamUrl();
    console.log(`Redirecting user to: ${finalUrl}`);
    res.redirect(finalUrl);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send(`Error getting stream URL: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
