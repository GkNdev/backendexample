const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // CORS middleware'ini ekle

app.get('/', async (req, res) => {
    try {
        const response = await fetch("https://vavoo.to/play/1536730627/index.m3u8");
        res.redirect(response.url);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
