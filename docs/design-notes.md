# Design notes: from hackathon screen to landing page

Internal note for the portfolio case study. Not a published docs page.

## Where it started

One screen: a logo, a title, a watch on the left, a stack of cards on the right. It worked, but it read as a demo. The problems, in order of weight:

- The watch was the concept, yet it only acted as a big button. The answer landed in a separate card.
- Demo controls sat at the same level as the product.
- No story: nothing said what Vital is, why it is safe, or how it is built.
- The logo borrowed another brand's mark.
- On phones the answer appeared two screens below the orb.

## Intent

Make the product the hero, then let the page explain it. A visitor should be able to talk to Vital within three seconds, and understand what it is without scrolling. Everything after the first screen answers one question each: what does it look like in use, how does it work, why trust it, how is it built, can I read the code.

## Art direction

Same family as the French health products it was built alongside, with its own identity.

- Warm cream page, one pastel block per section (indigo, peach, pink, teal), and a single deep indigo block for the technical section. The rhythm of blocks is the layout.
- Alan Sans, medium weight, very large and tight for headlines. A fluid scale from 360 to 1440 px, so there are no type breakpoints.
- Radii from 24 to 40 px, diffuse shadows, no borders, no pure black.
- A wordmark, "vital", with a small sign: an orb with two eyes and a smile, and the ring it gives off. It nods to the hackathon host without borrowing its logo. The same mark is the favicon.
- No stock photos, no mascot, no emoji. Visuals are the product's own pieces: the orb, a mic meter, real sample numbers.

## Decisions

**The watch answers on its own screen.** While thinking it shows the question; then the orb shrinks to the bottom and the answer takes the screen in large type. The hero is now complete on its own. The conversation panel stays in the demo as the written record and the place to type.

**One session, two places.** The hero watch and the demo watch share one voice session. The hero is the three-second try; the demo is the full console.

**Demo controls are labeled as demo controls.** The sample-day picker is a segmented control inside a "Demo data" strip that collapses. Sliders stay behind "Adjust numbers".

**Body Battery lost its battery drawing.** A soft gauge and one large number read faster and fit the rest. Each signal shows its gap to the usual value, colored by its effect on the score.

**Proof without social proof.** No testimonials, logos or invented figures. The Safety section quotes what the evals actually check. The Open source section shows the live release and CI status.

**Phone first.** Headline, then the watch at about 72% size on a pastel stage, with the orb in the thumb zone and the suggested questions right under it. Touch targets are 44 px under a finger and stay compact with a mouse.

**Motion with a job.** The hero enters in reading order. Sections fade up once as they arrive. Numbers count, the gauge slides, a dot travels through the pipeline. Only transform and opacity, and all of it stops under reduced motion.

## What was left out, on purpose

- **Dark mode.** Every pastel would need a tuned counterpart. An inverted theme would be worse than none.
- **GitHub stars.** The existing server call does not fetch them, and the count would add nothing the CI badge doesn't.
- **A motion library.** CSS and one small observer cover everything here.
- **A single SVG for the pipeline.** It is HTML with SVG icons instead, so it reflows from a row to a column and stays readable by a screen reader.
