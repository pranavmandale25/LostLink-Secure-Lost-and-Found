---
name: Private ownership data
description: Security rule for lost-and-found ownership verification data.
---

Private ownership clues must remain server-only. Public item, match, claim, dashboard, and handover responses should expose only safe metadata or an aggregate clue count; verification accepts evidence and returns only an outcome, never the correct answer.

**Why:** A claimant must not be able to read the answer from a normal item or match response and repeat it during verification.

**How to apply:** Keep private clues in a separate server-side structure or field, create explicit public DTOs that omit them, and run an exposure check whenever response shapes or seeded data change.