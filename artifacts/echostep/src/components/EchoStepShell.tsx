import type { ReactNode } from 'react';
import './echostep.css';

type EchoStepShellProps = {
  screen: 'title' | 'playing' | 'victory';
  onStart: () => void;
  onRestart: () => void;
  onTitle: () => void;
  runId: number;
  children: ReactNode;
};

function EchoMark() {
  return (
    <span className="echo-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export default function EchoStepShell({
  screen,
  onStart,
  onRestart,
  onTitle,
  runId,
  children,
}: EchoStepShellProps) {
  const isTitle = screen === 'title';

  return (
    <main className={`echo-shell echo-shell--${screen}`} data-testid="echostep-shell">
      <header className="echo-topbar">
        <div className="echo-brand" data-testid="text-echostep-brand">
          <EchoMark />
          <span>ECHO<span className="echo-brand__step">STEP</span></span>
        </div>
        <div className="echo-topbar__right">
          {!isTitle && (
            <span className="echo-run" data-testid="status-run-id">
              RUN {String(runId).padStart(2, '0')}
            </span>
          )}
        </div>
      </header>

      {isTitle ? (
        <section className="echo-title-screen" aria-labelledby="echo-title">
          <div className="echo-title-copy">
            <p className="echo-eyebrow" data-testid="text-title-kicker">
              THE ABANDONED LAB <span>—</span> MOVEMENT STUDY
            </p>
            <h1 id="echo-title" data-testid="text-game-title">
              Echo<span>Step</span>
            </h1>
            <p className="echo-title-screen__lede" data-testid="text-title-description">
              A quiet lab. A long way out.
              <br />
              Find the exit.
            </p>
            <button className="echo-button echo-button--primary" onClick={onStart} data-testid="button-start-game">
              <span>Start Game</span>
              <span className="echo-button__arrow" aria-hidden="true">↗</span>
            </button>
            <div className="echo-title-controls" data-testid="text-title-controls" aria-label="A and D or arrow keys to move; Space to jump">
              <div className="echo-title-controls__group">
                <span className="echo-title-controls__label">MOVE</span>
                <span className="echo-control-keys"><kbd>A</kbd><kbd>D</kbd><span>OR</span><kbd>←</kbd><kbd>→</kbd></span>
              </div>
              <div className="echo-title-controls__group">
                <span className="echo-title-controls__label">JUMP</span>
                <span className="echo-control-keys"><kbd className="echo-control-keys__space">SPACE</kbd></span>
              </div>
            </div>
          </div>

          <div className="echo-lab-art" aria-hidden="true">
            <div className="echo-lab-art__wall" />
            <div className="echo-lab-art__cabinet echo-lab-art__cabinet--one" />
            <div className="echo-lab-art__cabinet echo-lab-art__cabinet--two" />
            <div className="echo-lab-art__platform echo-lab-art__platform--a" />
            <div className="echo-lab-art__platform echo-lab-art__platform--b" />
            <div className="echo-lab-art__platform echo-lab-art__platform--c" />
            <div className="echo-lab-art__runner">
              <span className="echo-lab-art__runner-core" />
            </div>
            <div className="echo-lab-art__exit"><span>EXIT</span></div>
          </div>
        </section>
      ) : (
        <section className="echo-game-layout" aria-label="EchoStep game">
          <div className="echo-game-heading">
            <div>
              <p className="echo-eyebrow">THE ABANDONED LAB</p>
              <h1 className="echo-game-heading__title" data-testid="text-game-status">
                {screen === 'victory' ? 'Exit reached' : 'Find the exit'}
              </h1>
            </div>
            <button className="echo-button echo-button--quiet" onClick={onRestart} data-testid="button-restart">
              <span className="echo-restart-icon" aria-hidden="true">↻</span>
              Restart
            </button>
          </div>

          <div className="echo-stage-frame">
            <div className="echo-stage" data-testid="game-stage">
              {children}
            </div>
            {screen === 'victory' && (
              <div className="echo-victory-overlay" role="dialog" aria-modal="true" aria-labelledby="echo-victory-title">
                <div className="echo-victory-card">
                  <div className="echo-victory-card__stamp" aria-hidden="true"><EchoMark /></div>
                  <p className="echo-eyebrow" data-testid="text-victory-kicker">EXIT REACHED</p>
                  <h2 id="echo-victory-title" data-testid="text-victory-title">You made<br /><span>it out.</span></h2>
                  <p className="echo-victory-card__copy" data-testid="status-victory">
                    The test chamber is behind you. Take another run?
                  </p>
                  <button className="echo-button echo-button--primary" onClick={onRestart} data-testid="button-play-again">
                    <span>Play Again</span>
                    <span className="echo-button__arrow" aria-hidden="true">↗</span>
                  </button>
                  <button className="echo-text-button" onClick={onTitle} data-testid="button-back-to-title">
                    Back to Title
                  </button>
                </div>
              </div>
            )}
          </div>

          <footer className="echo-controls" aria-label="Game controls">
            <div className="echo-controls__group" data-testid="text-move-controls">
              <span className="echo-control-keys"><kbd>A</kbd><kbd>D</kbd><span>OR</span><kbd>←</kbd><kbd>→</kbd></span>
              <span className="echo-controls__label">to move</span>
            </div>
            <span className="echo-controls__divider" aria-hidden="true" />
            <div className="echo-controls__group" data-testid="text-jump-controls">
              <span className="echo-control-keys"><kbd className="echo-control-keys__space">SPACE</kbd></span>
              <span className="echo-controls__label">to jump</span>
            </div>
          </footer>
        </section>
      )}

      <div className="echo-footer" aria-hidden="true">ECHO STEP — A PLATFORMING EXPERIMENT</div>
    </main>
  );
}
