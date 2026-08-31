# Revamp QA Report

Run 31 August 2026 against the protected `website-revamp` release candidate.

## Automated static checks passed

- 18 HTML pages and 421 internal references checked.
- Exactly one H1, a document title, one main region and valid language metadata exist on every page.
- All local pages, images, stylesheets, scripts, manifest links and fragments resolve.
- No duplicate IDs, missing image alternative text, unsafe new-tab links or untyped buttons were found.
- Public HTML contains no `Mighty Bible 365`, `Mighty Bible T65` or `in production` wording.
- JavaScript syntax passes for `assets/site.js`, `assets/discovery-map.js` and `service-worker.js`.
- The final 10-card map data matches the approved code, anchor, Discovery Zone, Bible Era and Journey Trail key.
- All 20 sample front/back card images exist and all ten anchor coordinates are within the 2400 × 1698 map.

## Browser checks passed

- All 18 pages loaded with one H1, no broken published image and no page-level horizontal overflow at 1363 × 936.
- Homepage: four product cards, two music-video embeds, four social links, two merchandise routes and three prominent Virtual Bible Map routes.
- Mighty 365: the approved daily sample draw revealed its artwork and result copy.
- Hero Matchup: a random battle produced the correct two printed scores and winner statement.
- Bible Discovery Map: initialized with ten markers and no page runtime warnings or errors.
- Random draw: revealed the correct card, map code, anchor, active marker and highlighted coordinate cell.
- Card flip: changed from the selected front to its matching back with an updated accessible label.
- Direct card selection: Joseph resolved to D-08, Goshen, Egypt & the Nile, Era 2 and JT-02.
- Direct marker selection: Paul resolved to B-01, Rome and the correct front card.
- Map zoom: 100%, 125%, 150% and reset controls updated the map correctly.

## Performance, accessibility and privacy

- Product artwork uses modern WebP files and below-first-screen imagery is lazy loaded.
- The deployment workflow now stages only public HTML, runtime files and assets; archived root artwork and internal documents are not published.
- The map has native buttons, visible keyboard focus, arrow-key marker navigation, live announcements and reduced-motion support.
- Forms remain adult-only; no child account or child personal-information field exists.
- Mission Passport and daily draw progress remain device-local.

## Remaining launch checks

- GitHub environment deployment policy must allow `website-revamp`; current Pages policy allows only `main`.
- Confirm real Formspree delivery and unsubscribe handling with one owner-approved test submission.
- Confirm the external merchandise, social and YouTube destinations from a normal user browser.
- Complete current Safari/Edge and representative phone/tablet spot checks.
- Approve the provisional Mighty 365 and Hero Matchup rules listed in `SIMULATION_APPROVALS.md`.
- Supply the official Mighty Bible Battle rules before a valid board-game simulation is built.
