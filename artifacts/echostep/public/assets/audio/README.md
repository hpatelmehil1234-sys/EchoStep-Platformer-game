# EchoStep audio assets

The two required Pixabay MP3s are stored locally in this directory and are loaded by the standalone game in `../index.html`.

| Filename | Use | Official source |
| --- | --- | --- |
| `space-ambient-sci-fi-121842.mp3` | Looping background music | [Space Ambient Sci-Fi by Lexin_Music](https://pixabay.com/music/suspense-space-ambient-sci-fi-121842/) |
| `short-success-sound-glockenspiel-treasure-video-game-6346.mp3` | One-shot level completion sound | [Short Success Sound by freesound_community](https://pixabay.com/sound-effects/film-special-effects-short-success-sound-glockenspiel-treasure-video-game-6346/) |

Both assets were downloaded from the official Pixabay download links and are described on their pages as free to use under the [Pixabay Content License](https://pixabay.com/service/license-summary/). The license summary permits free use without required attribution but prohibits distributing content on a standalone basis; keep these files as game assets rather than offering them separately. The music page is marked “Content ID Registered,” which may matter when publishing gameplay videos.

Attribution for reference:

- Music: Lexin_Music (Aleksey Chistilin), “Space Ambient Sci-Fi,” Pixabay.
- Victory sound: freesound_community, “Short Success Sound - Glockenspiel / Treasure / Video Game,” Pixabay.

The game expects these exact filenames. Music loops at a subtle default level and starts only after Play. The victory sound is triggered once by the existing level-completion event. If either file is missing or cannot be decoded, the game continues without substituting different music or a different victory sound; other gameplay sound effects retain their existing behavior.
