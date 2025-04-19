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

  console.log(`Requesting: ${targetUrl}`);

  // Instead of redirecting, we'll get the content and serve it directly
  const options = {
    headers: {
      "User-Agent": "VAVOO/1.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://vavoo.to/",
    },
    timeout: 10000, // 10 second timeout
  };

  const request = https.get(targetUrl, options, (response) => {
    console.log(`Status Code: ${response.statusCode}`);
    console.log(`Headers: ${JSON.stringify(response.headers)}`);

    // If there's a redirect, follow it
    if (
      response.statusCode >= 300 &&
      response.statusCode < 400 &&
      response.headers.location
    ) {
      console.log(`Redirect found, following: ${response.headers.location}`);

      // Make a new request to the redirect location
      const redirectRequest = https.get(
        response.headers.location,
        options,
        (redirectResponse) => {
          console.log(`Redirect Status: ${redirectResponse.statusCode}`);

          // Set content type header for m3u8
          res.setHeader("Content-Type", "application/vnd.apple.mpegurl");

          // Copy other important headers
          if (redirectResponse.headers["content-disposition"]) {
            res.setHeader(
              "Content-Disposition",
              redirectResponse.headers["content-disposition"]
            );
          }

          // Pipe the response directly to the client
          redirectResponse.pipe(res);

          redirectResponse.on("error", (err) => {
            console.error("Redirect response error:", err.message);
            if (!res.headersSent) {
              res.status(500).send(`Error in stream: ${err.message}`);
            }
          });
        }
      );

      redirectRequest.on("error", (err) => {
        console.error("Redirect request error:", err.message);
        if (!res.headersSent) {
          res.status(500).send(`Error following redirect: ${err.message}`);
        }
      });

      redirectRequest.on("timeout", () => {
        console.error("Redirect request timed out");
        redirectRequest.destroy();
        if (!res.headersSent) {
          res.status(504).send("Redirect request timed out");
        }
      });

      return;
    }

    // No redirect, set content type for m3u8
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");

    // If there are any content disposition headers, copy them
    if (response.headers["content-disposition"]) {
      res.setHeader(
        "Content-Disposition",
        response.headers["content-disposition"]
      );
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

// Also add a route to serve TS files if needed
app.get("/*.ts", async (req, res) => {
  // Extract the ts filename from the request
  const tsFile = req.path.substring(1); // Remove leading slash

  // Construct the URL for the ts file
  const tsUrl = `https://vavoo.to/play/${tsFile}`;

  console.log(`Requesting TS file: ${tsUrl}`);

  const options = {
    headers: {
      "User-Agent": "VAVOO/1.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://vavoo.to/",
    },
    timeout: 10000,
  };

  const request = https.get(tsUrl, options, (response) => {
    console.log(`TS File Status: ${response.statusCode}`);

    // Set appropriate content type
    res.setHeader("Content-Type", "video/mp2t");

    // Pipe the response directly to the client
    response.pipe(res);

    response.on("error", (err) => {
      console.error("TS response error:", err.message);
      if (!res.headersSent) {
        res.status(500).send(`Error in TS stream: ${err.message}`);
      }
    });
  });

  request.on("error", (err) => {
    console.error("TS request error:", err.message);
    if (!res.headersSent) {
      res.status(500).send(`Error fetching TS file: ${err.message}`);
    }
  });

  request.on("timeout", () => {
    console.error("TS request timed out");
    request.destroy();
    if (!res.headersSent) {
      res.status(504).send("TS request timed out");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
