# OriginMind OS Website

One repository and one bilingual website program for OriginMind OS.

- English: https://www.originmindos.com/
- 中文: https://www.originmindos.cn/
- Contact: sales@originmindos.cn

Cloudflare Pages reads the request host in `_worker.js` and serves the matching language from the same deployment. The root of `.com` defaults to English and the root of `.cn` defaults to Chinese.

Both languages are also available on every connected hostname:

- `/en/` — English
- `/zh/` — 中文

The language switcher uses these explicit routes, so it remains usable on the custom domains and on the `pages.dev` deployment. The root page includes a `.cn` fallback redirect in case the edge worker is unavailable.
