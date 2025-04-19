const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    const response = await fetch("https://vavoo.to/play/1536730627/index.m3u8");
    res.redirect(response.url);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});