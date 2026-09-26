<h1 align="center">Vital</h1>

<p align="center">
  <em>Talk to your body.</em>
</p>

<p align="center">
  Hackathon demo.<br>
  Ask a question out loud, get a short spoken answer grounded in mocked Apple HealthKit data, powered by Mistral and Voxtral.
</p>

<p align="center">
  <img src="public/mockups/vital-demo.png" alt="Vital demo: Apple Watch voice assistant with Body Battery and conversation panel" width="100%">
</p>

<p align="left">
  <img src="https://badgen.net/badge/TanStack/Start/FF4154" alt="TanStack Start">
  <img src="https://badgen.net/badge/TypeScript/6/3178C6?icon=typescript" alt="TypeScript 6">
  <img src="https://badgen.net/badge/state/Hackathon%20demo/5C59F3" alt="State: Hackathon demo">
  <img src="https://badgen.net/badge/license/AGPL%203.0/green" alt="License: AGPL-3.0">
  <br><br>
  <a href="https://mistral.ai"><img src="public/badges/m-orange.svg" alt="Mistral AI" height="32"></a>
  <a href="https://www.apple.com/health/"><img src="public/badges/apple-health-en.svg" alt="Apple Health" height="32"></a>
</p>

---

> Built for the [**Alan × Mistral AI Health Hack**](https://luma.com/t7rspaka) — April 11, 2026, Paris.

<table border="0" cellspacing="0" cellpadding="0"><tr>
  <td align="center" valign="middle"><img src="public/mockups/alan-tweet.png" alt="Alan tweet: on a hâte de voir ça" width="480"></td>
  <td align="center" valign="middle"><a href="https://luma.com/t7rspaka"><img src="public/mockups/alan-x-mistral.png" alt="Alan × Mistral AI Health Hack" height="118"></a></td>
</tr></table>

## Quick start

Requires Node.js 22+, pnpm 10+ (`corepack enable`) and a [Mistral API key](https://console.mistral.ai/).

```bash
git clone https://github.com/vitalvie/vital.git && cd vital
pnpm install
cp apps/web/.env.example apps/web/.env   # then set MISTRAL_API_KEY
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), tap the watch and ask a question. The mic works on `localhost` or HTTPS; otherwise, type a question.

## License

[AGPL-3.0](LICENSE)

---
