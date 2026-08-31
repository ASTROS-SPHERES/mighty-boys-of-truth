# Release and Rollback Checklist

## Protected production source

- Production source branch: `website-revamp`
- Preserved legacy branch: `main`
- Preserved legacy SHA: `50403213f0812bf1bdbf335b6293423562ef5cb6`
- Rule: do not merge into or modify `main`.

## GitHub Pages publication

1. In repository Settings → Environments → `website-revamp-production`, allow deployments from the selected branch `website-revamp`.
2. Re-run the latest `Deploy Mighty Boys of Truth to GitHub Pages` workflow.
3. Confirm the workflow checkout SHA matches the current `website-revamp` head.
4. Confirm the public URL loads the revamped homepage and the interactive map.
5. Run the homepage-to-map journey, one random draw, one card flip and one marker selection on the public URL.

The workflow deploys a clean `_site` bundle containing only public HTML, runtime files and assets. Internal documentation and archived root artwork are not published.

## Rollback

If a launch-blocking issue affects trust, privacy, core functionality or product accuracy, redeploy the last verified `website-revamp` commit. Preserve `main` and do not rewrite or delete the revamp branch.
