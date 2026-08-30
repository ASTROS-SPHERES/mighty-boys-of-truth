# Privacy-Aware Event Plan

The website emits a local `mbot:analytics` custom event and, only when a separately configured `dataLayer` exists, pushes the same non-personal object there.

Current event vocabulary:

- `product_view` — product slug only
- `product_finder_selected` — product name only
- `component_selected` — approved component title only
- `card_draw_started` — mode only
- `card_revealed` / `sample_card_revealed` — approved sample identifier only
- `battle_demo_started` — mode only
- `battle_round_completed` — approved hero identifiers and selected statistic only
- `audience_path_selected` — destination path only
- `passport_badge_earned` / `passport_reset` — badge identifier only
- `adult_signup_submitted` / `adult_enquiry_submitted` — success or failure only
- `share_selected` — no personal data

Never add names, email addresses, form messages, child data, card responses or free text to analytics events.

No external analytics platform is enabled in this revamp. Adding one requires owner selection, consent/cookie review where applicable, retention settings and launch-territory privacy review.
