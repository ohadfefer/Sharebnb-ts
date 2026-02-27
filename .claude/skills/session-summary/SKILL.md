---
name: session-summary
description: Generates a structured summary of the current development session. Only run when the user explicitly invokes /session-summary.
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

Include only the categories relevant to the session. Use HTML `<span>` tags for color:

**Positive** — `<span style="color:green">### Positive Progress</span>`
Features that were added, bugs that were fixed, improvements shipped.

**Negative** — `<span style="color:red">### Negative Progress</span>`
Things the user tried but failed: bugs still unresolved, UI/UX still broken, blocked features.

**Pending** — `<span style="color:orange">### Pending Progress</span>`
Work heading in the right direction but not yet completed when the skill was called.

### Example output

```
## 2/26 - Stay Editor Fixes

<span style="color:green">### Positive Progress</span>
- Fixed crash on empty order list
- Added stay filtering by location

<span style="color:red">### Negative Progress</span>
- Google Maps API still broken — key configuration unresolved

<span style="color:orange">### Pending Progress</span>
- Stay Editor form partially wired to Redux, not yet complete
```
