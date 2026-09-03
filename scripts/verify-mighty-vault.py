#!/usr/bin/env python3
"""Fail CI if the Mighty Vault production contract is broken."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []

def require_file(rel):
    p = ROOT / rel
    if not p.is_file():
        errors.append(f"Missing required file: {rel}")
    return p

def require_text(rel, needles):
    p = require_file(rel)
    if not p.is_file():
        return ""
    text = p.read_text(encoding="utf-8")
    for needle in needles:
        if needle not in text:
            errors.append(f"{rel}: missing required marker: {needle}")
    return text

required_assets = [
    "mighty-vault.html",
    "assets/mighty-vault.js",
    "assets/mighty-vault.css",
    "assets/mighty-vault-final.css",
    "assets/mighty-vault-card-atlas.webp",
    "assets/vault-aquila.webp",
    "assets/vault-lydia.webp",
    "assets/vault-phoebe.webp",
    "assets/mighty-vault-home-entry.webp",
    "assets/site.js",
    "service-worker.js",
]
for asset in required_assets:
    require_file(asset)

vault_html = require_text("mighty-vault.html", [
    "data-open-pack",
    "data-collect-pack",
    "data-vault-grid",
    "data-vault-modal",
    "data-unique-count",
    "data-points",
    "data-streak",
    "data-rare-count",
    "assets/mighty-vault.js",
])

vault_js = require_text("assets/mighty-vault.js", [
    'mbot-mighty-vault-v1',
    'Mighty Vault failed to initialize',
    'document.documentElement.dataset.vaultReady="true"',
    'data-filter',
    'lastOpen',
    'lastPack',
    'pending',
])

# Hero roster must be exactly 64 and contain the final three heroes.
match = re.search(r'const N="([^"]+)"\.split\("\\\|"\)', vault_js)
if not match:
    # Current minified form uses split("|").
    match = re.search(r'const N="([^"]+)"\.split\("\|"\)', vault_js)
if match:
    heroes = match.group(1).split("|")
    if len(heroes) != 64:
        errors.append(f"Hero roster is {len(heroes)}, expected 64")
    expected_tail = ["Aquila", "Lydia", "Phoebe"]
    if heroes[-3:] != expected_tail:
        errors.append(f"Final hero roster mismatch: {heroes[-3:]} != {expected_tail}")
else:
    errors.append("Could not parse 64-hero roster from assets/mighty-vault.js")

# Direct art overrides for final heroes must exist in code.
for index, filename in [(61, "vault-aquila.webp"), (62, "vault-lydia.webp"), (63, "vault-phoebe.webp")]:
    if f"{index}:`assets/{filename}" not in vault_js:
        errors.append(f"Missing direct card art mapping for hero index {index}: {filename}")

# Homepage must expose Vault through current production entry logic.
site_js = require_text("assets/site.js", [
    "Homepage Mighty Vault entry point",
    'mighty-vault.html',
    'mighty-vault-home-entry.webp',
    'homepage-vault-entry',
    'nav-vault-link',
])

index_html = require_text("index.html", ["assets/site.js"])
if "mighty-vault.html" not in index_html and "Homepage Mighty Vault entry point" not in site_js:
    errors.append("Homepage has no Mighty Vault entry path")

# Service worker must ship all critical Vault resources.
sw = require_text("service-worker.js", [
    "mighty-vault.html",
    "assets/mighty-vault.js",
    "assets/mighty-vault-card-atlas.webp",
    "assets/vault-aquila.webp",
    "assets/vault-lydia.webp",
    "assets/vault-phoebe.webp",
    "assets/mighty-vault-home-entry.webp",
])

# Ensure all local assets referenced from Vault HTML actually exist.
for ref in re.findall(r'(?:src|href)=["\']([^"\'#?]+)', vault_html):
    if ref.startswith(("http://", "https://", "mailto:", "#")):
        continue
    target = ROOT / ref
    if not target.exists():
        errors.append(f"mighty-vault.html references missing local resource: {ref}")

if errors:
    print("MIGHTY VAULT VERIFICATION FAILED")
    for error in errors:
        print(f" - {error}")
    sys.exit(1)

print("MIGHTY VAULT VERIFICATION PASSED")
print(" - 64 heroes confirmed")
print(" - final Aquila/Lydia/Phoebe artwork mappings confirmed")
print(" - Vault page interaction hooks confirmed")
print(" - homepage Vault entry logic confirmed")
print(" - critical deployed assets confirmed")
print(" - service-worker Vault cache coverage confirmed")
