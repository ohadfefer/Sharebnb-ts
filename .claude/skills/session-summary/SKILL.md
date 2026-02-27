---
name: session-summary
description: Write a structured summary of the current development session for SESSION_LOG.md. Only run when the user explicitly invokes /session-summary.
---

## Before generating the summary

Ask the user how to classify the overall session progress. Give exactly 3 options:
- Positive
- Negative
- Pending

Wait for the user's answer, then generate the summary.

## Summary format

### Title
Include the current date and a short topic: `## MM/DD - <Topic>`
Example: `## 2/26 - Stay Editor Fixes`

### Categories

Include only the categories relevant to the session.

**Positive** — Features that were added, bugs that were fixed, improvements shipped.

**Negative** — Things the user tried but failed: bugs still unresolved, UI/UX still broken, blocked features.

**Pending** — Work heading in the right direction but not yet completed when the skill was called.

### Example output

```
## 2/26 - Stay Editor Fixes

### Positive Progress
- Fixed crash on empty order list
- Added stay filtering by location

### Negative Progress
- Google Maps API still broken — key configuration unresolved

### Pending Progress
- Stay Editor form partially wired to Redux, not yet complete
```
