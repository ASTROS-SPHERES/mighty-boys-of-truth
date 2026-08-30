# Release and Rollback Checklist

## Protected release candidate

- Source branch: `website-revamp`
- Rollback point: current `main` commit before any approved merge
- Rule: do not merge or modify `main` without separate owner approval

## Before public publication

1. Review the homepage and all four product pages on mobile and desktop.
2. Complete the approval list in `SIMULATION_APPROVALS.md` for official-rule wording.
3. Confirm adult form delivery and unsubscribe handling.
4. Confirm all social, merchandise and YouTube destinations.
5. Approve the current product images and absence of unapproved Eli imagery.
6. Complete launch-territory privacy/legal review.
7. Record final owner approval from Stephan Naude.

## Controlled publication

1. Freeze the approved branch commit.
2. Preserve the pre-launch `main` commit SHA.
3. Merge only after explicit owner approval.
4. Verify homepage, product pages, demos, forms, privacy, social and merchandise destinations on the public URL.
5. Monitor form failures and navigation errors.

## Rollback

If a launch-blocking issue affects trust, privacy, core functionality or product accuracy, redeploy the recorded pre-launch `main` commit. Do not rewrite or delete the protected revamp branch; keep it available for diagnosis and correction.
