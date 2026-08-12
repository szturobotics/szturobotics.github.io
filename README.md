# OriginMind OS Website

One repository and one bilingual website program for OriginMind OS.

- English: https://www.originmindos.com/
- 中文: https://www.originmindos.cn/
- Contact: sales@originmindos.cn

Cloudflare Pages reads the request host in `_worker.js` and serves the matching language from the same deployment. English and Chinese pages are generated from the same component and shared stylesheet.
