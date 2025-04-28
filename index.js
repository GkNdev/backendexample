const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/:filename", async (req, res) => {
  const filename = req.params.filename;
  try {
    if (filename === "bein1.m3u8") {
      console.log("BeIN Sports 1 kanalı çalıştırıldı");
      const response = await fetch("https://www.selcuksports122.top");
      const html = await response.text();
      const matches = html.matchAll(/data-streamx="([^"]*sports-1\.m3u8)"/g);

      for (const match of matches) {
        if (match[1]) {
          res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
          return res.send(`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1500000,RESOLUTION=1920x1080
${match[1]}`);
        }
      }
      return res.status(404).json({
        error: "M3U8 dosyası bulunamadı.",
      });
    } else if (filename === "bein2.m3u8") {
      console.log("BeIN Sports 2 kanalı çalıştırıldı");
      const response = await fetch("https://www.selcuksports122.top");
      const html = await response.text();
      const matches = html.matchAll(/data-streamx="([^"]*sports-2\.m3u8)"/g);

      for (const match of matches) {
        if (match[1]) {
          res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
          return res.send(`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1500000,RESOLUTION=1920x1080
${match[1]}`);
        }
      }
      return res.status(404).json({
        error: "M3U8 dosyası bulunamadı.",
      });
    } else if (filename === "bein3.m3u8") {
      console.log("BeIN Sports 3 kanalı çalıştırıldı");
      const response = await fetch("https://www.selcuksports122.top");
      const html = await response.text();
      const matches = html.matchAll(/data-streamx="([^"]*sports-3\.m3u8)"/g);

      for (const match of matches) {
        if (match[1]) {
          res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
          return res.send(`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1500000,RESOLUTION=1920x1080
${match[1]}`);
        }
      }
      return res.status(404).json({
        error: "M3U8 dosyası bulunamadı.",
      });
    } else if (filename === "bein4.m3u8") {
      console.log("BeIN Sports 4 kanalı çalıştırıldı");
      const response = await fetch("https://www.selcuksports122.top");
      const html = await response.text();
      const matches = html.matchAll(/data-streamx="([^"]*sports-4\.m3u8)"/g);

      for (const match of matches) {
        if (match[1]) {
          res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
          return res.send(`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1500000,RESOLUTION=1920x1080
${match[1]}`);
        }
      }
      return res.status(404).json({
        error: "M3U8 dosyası bulunamadı.",
      });
    } else if (filename === "nowtv.m3u8") {
      console.log("Now TV kanalı çalıştırıldı");
      const response = await fetch("https://www.nowtv.com.tr/canli-yayin");
      const html = await response.text();
      const lines = html.split("\n");
      const hlsLine = lines.find((line) => line.includes("daiUrl"));

      if (hlsLine) {
        const match = hlsLine.match(/daiUrl : '([^"]+)'/);
        if (match) {
          const hlsUrl = match[1];
          res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
          return res.send(`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1500000,RESOLUTION=1920x1080
${hlsUrl}`);
        } else {
          return res.status(404).json({
            error:
              "HLS URL Bulunamadı , goflex telegramdan admine bildirebilirsiniz.",
          });
        }
      } else {
        return res.status(404).json({
          error:
            "HLS URL Bulunamadı , goflex telegramdan admine bildirebilirsiniz.",
        });
      }
    } else if (filename === "ss1.m3u8") {
      console.log("S Sport 1 kanalı çalıştırıldı");
      return res.send(`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1500000,RESOLUTION=1920x1080
https://bcovlive-a.akamaihd.net/540fcb034b144b848e7ff887f61a293a/eu-central-1/6415845530001/profile_0/chunklist.m3u8`);
    } else if (filename === "ss2.m3u8") {
      console.log("S Sport 2 kanalı çalıştırıldı");
      return res.send(`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1500000,RESOLUTION=1920x1080
https://bcovlive-a.akamaihd.net/29c60f23ea4840ba8726925a77fcfd0b/eu-central-1/6415845530001/profile_0/chunklist.m3u8`);
    } else if (filename === "sozcu.m3u8") {
      console.log("Sözcü TV kanalı çalıştırıldı");
      return res.redirect(
        "https://koprulu2.global.ssl.fastly.net/yt.m3u8/?id=ztmY_cCtUl0&pp=ygURc8O2emPDvCB0diBjYW5sxLE%3D.m3u8"
      );
    } else if (filename === "ahaber.m3u8") {
      return res.redirect(
        "https://koprulu2.global.ssl.fastly.net/yt.m3u8/?id=nmY9i63t6qo"
      );
    } else if (filename === "apara.m3u8") {
      return res.redirect(
        "https://koprulu2.global.ssl.fastly.net/yt.m3u8/?id=nbBAMY19PkU"
      );
    } else if (filename === "cnnturk.m3u8") {
      return res.redirect(
        "https://koprulu2.global.ssl.fastly.net/yt.m3u8/?id=VXMR3YQ7W3s"
      );
    } else if (filename === "tabii1.m3u8") {
      return res.send(`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1500000,RESOLUTION=1920x1080
https://iaqzu4szhtzeqd0edpsayinle.medya.trt.com.tr/master_1080p.m3u8`);
    } else if (filename === "tabii2.m3u8") {
      return res.send(`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1500000,RESOLUTION=1920x1080
https://klublsslubcgyiz7zqt5bz8il.medya.trt.com.tr/master_1080p.m3u8`);
      return res.send(`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1500000,RESOLUTION=1920x1080
https://vbtob9hyq58eiophct5qctxr2.medya.trt.com.tr/master_1080p.m3u8`);
    } else if (filename === "eurostar.m3u8") {
      const response = await fetch(
        "https://github.com/ipstreet312/freeiptv/raw/refs/heads/master/ressources/tur/estar.m3u8"
      );
      const m3u8Content = await response.text();
      return res.send(m3u8Content);
    }

    return res.status(404).json({
      error: "Dosya bulunamadı.",
    });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({
      error: "Sunucu hatası oluştu.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
