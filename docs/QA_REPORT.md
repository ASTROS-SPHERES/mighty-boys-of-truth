# Revamp QA Report

Run 30 August 2026 against the protected `website-revamp` release candidate.

## Automated static checks passed

- 18 HTML pages parsed.
- Exactly one H1 exists on every page.
- Required titles and descriptions are present on indexable pages.
- All local page, image, stylesheet, script, manifest and fragment references resolve.
- All images include alternative-text attributes.
- All iframes include titles.
- New-tab links include `noopener` protection.
- Interactive buttons declare a button type.
- All JSON-LD blocks and the web app manifest parse as valid JSON.
- JavaScript syntax passes for `assets/site.js` and `service-worker.js`.
- CSS braces are balanced.
- Service-worker pre-cache references exist.
- All 18 HTML entry points, manifest, service worker, CSS and JavaScript returned HTTP 200 from a local server.
- 42 approved product WebPs are present: 13 Mighty 365, 4 Bible Discovery, 9 Hero Matchup and 16 Bible Battle.
- Public HTML contains no `Mighty Bible 365`, `Mighty Bible T65` or `in production` wording.
- Hero Matchup data test passed for seven cards across seven statistics.
- Both simulation entry points are present.

## Performance-oriented implementation

- Product artwork uses modern WebP files.
- Largest current product image is about 352 KB.
- Below-first-screen images use lazy loading and asynchronous decoding.
- First product hero images use high fetch priority.
- Shared CSS is about 34 KB and shared JavaScript about 18 KB before transfer compression.
- Image/video dimensions are reserved through responsive containers to reduce layout movement.
- External YouTube embeds are lazy loaded.
- Reduced-motion preferences disable non-essential transition duration.

## Accessibility and privacy implementation

- Skip link and visible keyboard focus.
- Keyboard-operable native buttons, links, selects, details/summary FAQs and form controls.
- Live regions announce form, draw, passport and battle results.
- No child account or child personal-information fields.
- Adult confirmation on launch and enquiry forms.
- Device-local Mission Passport with reset.
- Daily draw stores only date and sample index.
- Demo events exclude form contents and child data.

## External sign-off still required

- Owner visual review on representative mobile and desktop devices.
- Current Chrome, Safari and Edge spot checks.
- Adult beta feedback from parents, church leaders and educators.
- Real form-delivery and unsubscribe confirmation.
- Launch-territory privacy/legal review.
- Official simulation-rule approvals in `SIMULATION_APPROVALS.md`.
- Explicit owner approval before any merge or public deployment.
