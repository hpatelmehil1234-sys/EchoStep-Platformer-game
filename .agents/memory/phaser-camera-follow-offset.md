---
name: Phaser camera framing
description: Phaser follow-offset direction for forward-biased framing in EchoStep.
---

Phaser subtracts a follow offset from the followed object's position. A positive horizontal offset shifts the runner right on screen; a negative offset shifts the runner left and reveals more of the route ahead.

**Why:** A positive value put the runner too far to the right during the middle of the level. The corrected framing kept the runner visible at the start, middle, and end.

**How to apply:** When adjusting EchoStep's horizontal framing, use a negative offset for forward look-ahead, then verify camera scroll and player position at both world bounds and the level midpoint.
