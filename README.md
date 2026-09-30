<h1 align="center">Vital</h1>

<p align="center">
  <em>Talk to your body.</em>
</p>

> Built for the [**Alan × Mistral AI Health Hack**](https://luma.com/t7rspaka) — April 11, 2026, Paris.

<table border="0" cellspacing="0" cellpadding="0"><tr>
  <td align="center" valign="middle"><img src="public/mockups/alan-tweet.png" alt="Alan tweet: on a hâte de voir ça" height="129"></td>
  <td align="center" valign="middle"><a href="https://luma.com/t7rspaka"><img src="public/mockups/alan-x-mistral.png" alt="Alan × Mistral AI Health Hack" height="129"></a></td>
</tr></table>

<p align="left">
  <a href="https://vital.dhicham-pro.workers.dev"><b>Give it a try →</b></a>
</p>

<p align="center">
  <img src="public/mockups/demo-app.png" alt="Vital: tap the watch to talk, with the answer on the right" width="100%">
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

## Quick start

Requires Node.js 22+, pnpm 10+ (`corepack enable`) and an [OpenRouter API key](https://openrouter.ai/keys).

```bash
git clone https://github.com/vitalvie/vital.git && cd vital
pnpm install
cp apps/web/.env.example apps/web/.env   # then set OPENROUTER_API_KEY
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Tap the watch, or pick a question. The mic works on `localhost` or HTTPS; otherwise, type a question. The app opens on a well-rested sample day.

### Change the mocked data

Under the title, pick **Short night**, **Well rested** or **Stressful week**, or click **Adjust numbers** and move the sliders for last night's sleep, HRV and resting heart rate. Vital answers with those numbers.

To change the 14-day history or the presets, edit [`apps/web/src/data/mock-health.ts`](apps/web/src/data/mock-health.ts), then update the expected scores in the tests so `pnpm test` stays green.

## License

[AGPL-3.0](LICENSE)

---
