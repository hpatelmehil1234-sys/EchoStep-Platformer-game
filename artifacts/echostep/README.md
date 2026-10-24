# EchoStep

EchoStep is a self-contained, single-player puzzle-platformer set in an abandoned movement-research facility. Record and replay your movement to hold pressure plates, then use the time the echo buys you to cross sealed gates.

## Run

The playable game is `index.html`. It uses built-in browser features: HTML, CSS, JavaScript, the Canvas 2D API, and Web Audio API. The locally stored Pixabay music and victory sound are used as the selected soundtrack and level-completion cue; the other gameplay sound effects keep their existing behavior. See [`public/assets/audio/README.md`](./public/assets/audio/README.md) for the asset filenames, sources, and license notes. The game does not hotlink external audio.

1. To play with the selected local audio files, run `pnpm --filter @workspace/echostep dev` from the repository root and open the local Vite URL it prints. The files in `public/assets/audio/` are served at `/assets/audio/`. Browsers may block local media when `index.html` is opened directly with `file://`.
2. You can also open `index.html` directly to play the game. The game remains playable if the browser blocks the selected audio files.
3. Select **Choose a trial** and pick an available level.
4. Use **A / D** or the **left / right arrow keys** to move, and **Space** to jump.
5. Follow the plate and gate labels. Press **R** to start a recording and **R** again to stop; press **E** to replay it.
6. While the echo repeats its recorded path, move to the exit. The gate stays solid until its linked plate is held.
7. Complete a level to unlock the next trial. The **Levels** button returns to selection without clearing unlocked progress.
8. **Backspace** returns to the latest checkpoint and keeps a completed recording. Falling also returns you to that checkpoint. **Restart** begins the current level again.
9. The completion screen's **Continue** button loads the next unlocked trial. Completed levels can be replayed from selection.

The game can also be served as a static file using any existing local web server, but this is optional.

## Controls

| Action | Keys |
| --- | --- |
| Move left | A or Left Arrow |
| Move right | D or Right Arrow |
| Jump | Space |
| Start / stop recording | R |
| Play recorded echo | E |
| Reset puzzle to checkpoint | Backspace |

Use the **Sound** control in the top bar to enable or disable Music and Sound Effects independently, adjust their separate volume sliders, or mute/unmute all audio. Sound preferences are stored locally in the browser. Music pauses while the level archive is open or the page is hidden, and resumes between trials without restarting. The recording indicator shows whether the game is recording, ready to play, or replaying. Playback follows recorded positions and timing; the echo does not run a second physics simulation or act as a solid platform. Only marked pressure plates respond to the player or echo, and each gate is linked to its own plate. A closed gate blocks movement from the sides and above. Its visible panel and collision bounds move together. Checkpoints clear the previous sequence where a new gate begins. Moving patrols are hazards: touching one returns you to the last checkpoint while preserving a completed recording.

## Levels

- **1 — First Steps (Easy):** learn to jump and hold a plate with an echo.
- **2 — Timing Basics (Easy):** record an elevated plate and cross a broken walkway.
- **3 — Moving Hazards (Easy–Medium):** time a jump past a slow moving patrol.
- **4 — Echo Platforms (Medium):** leave an echo on a raised plate while taking the lower route. Echoes activate plates but are not solid.
- **5 — Switch Sequence (Medium):** open two gates in order, recording again after a checkpoint.
- **6 — Precision Route (Medium):** follow a series of stepped jumps sized for the standard jump physics.
- **7 — Split Paths (Medium–Hard):** choose between upper and lower paths, visiting the plate on the upper branch.
- **8 — Multi-Step Puzzle (Hard):** combine a gap, patrol, checkpoint, and two recordings.
- **9 — Advanced Echo (Hard):** solve three checkpoint-separated plate and gate sequences.
- **10 — The Final Trial (Expert):** combine three gates, patrols, platform jumps, and checkpoints.
- **11–14 — Archive trials (Bonus):** replay the four original chambers after completing the main ten.

The level archive shows each trial's number, name, difficulty, and locked, available, or completed state. Completing a trial unlocks the next one; available and completed trials can be replayed, and the victory panel provides a next-level button. Section labels, plate labels, gate states, patrols, and checkpoint markers are shown in the environment. The status line below the game gives immediate feedback when a plate or gate changes state. Unlock and completion progress is stored locally in the browser under `echostep-progress-v1`; it is not sent over the network.

## Compatibility

Use a current browser with Canvas 2D support, such as a recent version of Firefox, Chrome, Edge, or Safari. The game is designed for keyboard play on desktop and scales to narrow screens. No account or network connection is needed.

## Project structure

- `index.html` — complete playable game, including markup, styling, level, physics, and rendering.
- `src/` — earlier React/Phaser workspace implementation retained for reference; it is not loaded by the standalone game.

To customize the standalone game, edit the `levels` definitions, shared physics and puzzle logic, drawing functions, or update loop in `index.html`.
