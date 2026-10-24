# Optional local audio assets

Pixabay blocked automated access to the supplied music page and license page (HTTP 403) during implementation, so no Pixabay files have been downloaded or bundled. The game continues to work with locally synthesized Web Audio music and effects until optional files are added here.

To enable the local tracks, download each file yourself from its official Pixabay page, verify the current Pixabay Content License and any track-specific terms, and save it using these exact names:

| Filename | Source |
| --- | --- |
| `space-ambient-sci-fi-121842.mp3` | [Space Ambient Sci-Fi](https://pixabay.com/music/suspense-space-ambient-sci-fi-121842/) |
| `ghost-replay.mp3` | Choose a short (0.3–1.5 s) subtle shimmer or time-warp effect from [Pixabay magic sound effects](https://pixabay.com/sound-effects/search/magic/) |
| `switch-activation.mp3` | Choose a short electronic switch confirmation from [Pixabay sci-fi sound effects](https://pixabay.com/sound-effects/search/sci-fi/) |
| `hazard-trigger.mp3` | Choose a restrained, short effect matching the patrols and laser hazards present in some levels from [Pixabay laser sound effects](https://pixabay.com/sound-effects/search/laser/) |
| `level-complete.mp3` | Choose a short electronic victory chime from [Pixabay game-success sound effects](https://pixabay.com/sound-effects/search/game%20success/) |

Do not hotlink Pixabay or add a downloaded file unless its current license permits the intended use. Music is looped by the browser; use a seamlessly loopable track for the best result. The selected clips should be brief and restrained: ghost shimmer 0.3–1.5 seconds, subtle switch confirmation, quiet hazard warning, and a short victory chime.

When served by Vite, the files belong in this directory and are available under `/assets/audio/`. Direct `file://` opening deliberately uses the generated fallback instead, because browsers do not reliably allow checking local asset availability from a file URL. Missing or undecodable assets do not interrupt gameplay; the effects fall back to synthesized sounds and music falls back to the built-in ambient loop.
