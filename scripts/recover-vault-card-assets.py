#!/usr/bin/env python3
from pathlib import Path
import base64
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "assets/mighty-vault/card-data"
OUT_DIR = ROOT / "assets/mighty-vault/cards"

# Match every embedded HMM WebP data URI independently so one damaged card cannot
# prevent the forensic scan from discovering later valid cards.
pattern = re.compile(r'"(HMM-\d{3})"\s*:\s*"data:image/webp;base64,([^"\\]*)"')
found = {}
sources = {}
problems = []

for path in sorted(DATA_DIR.glob("*.js")):
    text = path.read_text(encoding="utf-8", errors="replace")
    matches = pattern.findall(text)
    print(f"{path.name}: {len(matches)} embedded card(s)")
    for card_id, payload in matches:
        try:
            data = base64.b64decode(payload, validate=True)
        except Exception as exc:
            problems.append(f"{card_id} in {path.name}: invalid base64 ({exc})")
            continue
        if len(data) < 20 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
            problems.append(f"{card_id} in {path.name}: invalid WebP container")
            continue
        declared = int.from_bytes(data[4:8], "little") + 8
        if declared != len(data):
            problems.append(
                f"{card_id} in {path.name}: truncated WebP declared={declared}, actual={len(data)}"
            )
            continue
        # Prefer the largest valid copy when the same ID occurs in multiple staging bundles.
        if card_id not in found or len(data) > len(found[card_id]):
            found[card_id] = data
            sources[card_id] = path.name

expected = [f"HMM-{i:03d}" for i in range(1, 65)]
missing = [x for x in expected if x not in found]
extra = sorted(set(found) - set(expected))
print(f"Unique valid cards recovered: {len(found)}")
if missing:
    print("Missing IDs: " + ", ".join(missing))
if extra:
    print("Unexpected IDs: " + ", ".join(extra))
if problems:
    print("Corrupt staged entries:")
    for problem in problems:
        print(" - " + problem)

# Write the valid recovered subset for deterministic forensic inspection in CI.
OUT_DIR.mkdir(parents=True, exist_ok=True)
for old in OUT_DIR.glob("hmm-*.webp"):
    old.unlink()
for card_id in expected:
    if card_id in found:
        number = card_id.split("-")[1]
        (OUT_DIR / f"hmm-{number}.webp").write_bytes(found[card_id])

manifest = OUT_DIR / "RECOVERY-MANIFEST.txt"
manifest.write_text(
    "\n".join(f"{cid} {len(found[cid])} bytes {sources[cid]}" for cid in expected if cid in found) + "\n",
    encoding="utf-8",
)

if missing or extra or len(found) != 64:
    print("Mighty Vault card recovery is incomplete; production install blocked.")
    sys.exit(2)

print("All 64 Mighty Vault card images recovered and validated.")
