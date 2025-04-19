const express = require("express");
const cors = require("cors");
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
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(
      "https://vavoo.to/play/1536730627/index.m3u8",
      {
        headers: {
          "User-Agent": "VAVOO/1.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://vavoo.to/",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    res.redirect(response.url);
  } catch (error) {
    console.error("Error fetching stream:", error.message);
    if (error.name === "AbortError") {
      res
        .status(504)
        .send("Request timeout - the external server took too long to respond");
    } else {
      res.status(500).send(`Error fetching stream: ${error.message}`);
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
