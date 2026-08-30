# Simulation Approval Checklist

Both website engines are implemented in this branch:

- `draw-a-card.html` — device-local daily draw using the two approved Mighty 365 sample artworks supplied for the revamp
- `hero-matchup-demo.html` — seven-hero stat comparison using exact values printed on the supplied Hero Matchup cards

## Make the Mighty 365 draw official

1. Confirm the online sample whitelist. Current website samples:
   - Family & Respect — morning sample
   - Wisdom & Choices — evening sample
2. Supply or approve the official Mighty 365 card-back artwork. The current unrevealed state is a website-only branded cover.
3. Confirm whether the public experience should allow:
   - one featured draw per device per day;
   - a clearly labelled second approved sample; or
   - only the daily draw.
4. Confirm whether the two supplied artworks remain separate samples. The website does not imply that they are the front and back of one card.
5. Approve accessible text transcripts for each sample if the card copy may be reproduced outside the artwork.
6. Supply approved Eli audio and transcript only if “Hear Eli Read It” is required.

## Make the Hero Matchup comparison official

1. Confirm that the higher printed statistic wins.
2. Confirm tie handling. Current website preview: equal values produce a tie.
3. Confirm the official online hero whitelist. The current seven are Abraham, Moses, Gideon, David, Elijah, Esther and Paul.
4. Confirm the seven exact printed statistics listed in `HERO_MATCHUP_DATA.md`.
5. Confirm whether a player chooses the statistic before or after both heroes are visible.
6. Confirm whether random matchup and side swapping remain public demo controls.
7. Approve the one-sentence official demo rule and result language.

## If “battle simulation” means Mighty Bible Battle

The live demo correctly belongs to **Mighty Hero Matchup**, because it compares hero statistics. A separate Mighty Bible Battle board-game simulation needs the approved production rules below before it can resolve a valid turn:

- setup and turn order;
- movement and die-face meanings;
- Question, Battle Burst, Realm Challenge and Mighty Move resolution;
- timer use;
- victory-cube earning and spending;
- win, tie and end conditions;
- a small approved online card/question whitelist with correct answers;
- any realm-specific exceptions.

The interface can then be connected to those rules without redesigning the website.
