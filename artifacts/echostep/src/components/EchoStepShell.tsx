import type { ReactNode } from 'react';
import { formatCompletionTime, type LevelCompletion } from '@/game/levelTimes';
import type { LevelOption } from '@/App';
import './echostep.css';

type EchoStepShellProps = {
  screen: 'title' | 'level-select' | 'playing' | 'victory';
  completion: LevelCompletion | null;
  levels: LevelOption[];
  selectedLevelId: string;
  onStart: () => void;
  onSelectLevel: (levelId: string) => void;
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
  completion,
  levels,
  selectedLevelId,
  onStart,
  onSelectLevel,
  onRestart,
  onTitle,
  runId,
  children,
}: EchoStepShellProps) {
  const isTitle = screen === 'title';
  const isLevelSelect = screen === 'level-select';

  return (
    <main className={`echo-shell echo-shell--${screen}`} data-testid="echostep-shell">
      <header className="echo-topbar">
        <div className="echo-brand" data-testid="text-echostep-brand">
          <span className="echo-brand__label">
            <EchoMark />
            <span>ECHO<span className="echo-brand__step">STEP</span></span>
          </span>
        </div>
        <div className="echo-topbar__right">
          <div className="echo-soundwave" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          {!isTitle && !isLevelSelect && (
            <span className="echo-run" data-testid="status-run-id">
              RUN {String(runId).padStart(2, '0')}
            </span>
          )}
        </div>
      </header>

      {isTitle ? (
        <section className="echo-title-screen" aria-labelledby="echo-title">
          <div className="echo-title-panel">
            <div className="echo-panel-status">
              <div className="echo-status-row">
                <span className="echo-status-chip">CAUTION</span>
                <span className="echo-status-chip echo-status-chip--muted">HIGH VOLTAGE</span>
              </div>
              <div className="echo-status-row echo-status-row--between">
                <span className="echo-status-label">UNIT STATUS: ACTIVE</span>
                <span className="echo-led echo-led--green" aria-hidden="true" />
              </div>
              <div className="echo-status-row echo-status-row--between">
                <span className="echo-status-label">POWER LOAD: NOMINAL</span>
                <span className="echo-led echo-led--red" aria-hidden="true" />
              </div>
            </div>

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
                <span>CHOOSE A TRIAL</span>
                <span className="echo-button__arrow" aria-hidden="true">↗</span>
              </button>
            </div>

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

          <div className="echo-monitor-panel" aria-hidden="true">
            <div className="echo-monitor-panel__scanline" />
            <div className="echo-monitor-header">
              <span>FIG. 01 / TEST CHAMBER</span>
              <span>BTT PORTAL</span>
            </div>
            <div className="echo-monitor-screen">
              <div className="echo-monitor-grid" />
              <div className="echo-monitor-entity echo-monitor-entity--player">
                <span className="echo-monitor-entity__core" />
              </div>
              <div className="echo-monitor-entity echo-monitor-entity--door">
                <span className="echo-monitor-entity__core" />
              </div>
              <div className="echo-terminal-label echo-terminal-label--left">PLAYER VSN #7</div>
              <div className="echo-terminal-label echo-terminal-label--right">PLATFORM RESHES</div>
            </div>
          </div>
        </section>
      ) : isLevelSelect ? (
        <section className="echo-level-select" aria-labelledby="echo-level-select-title">
          <div className="echo-level-panel echo-level-panel--selection">
            <div className="echo-panel-status">
              <div className="echo-status-row">
                <span className="echo-status-chip">TRIAL INDEX</span>
                <span className="echo-status-chip echo-status-chip--muted">ACTIVE</span>
              </div>
              <div className="echo-status-row echo-status-row--between">
                <span className="echo-status-label">UNIT STATUS: READY</span>
                <span className="echo-led echo-led--green" aria-hidden="true" />
              </div>
            </div>

            <div className="echo-level-copy">
              <p className="echo-eyebrow" data-testid="text-level-select-kicker">
                SELECT <span>—</span> CHAMBER TRIAL
              </p>
              <h2 id="echo-level-select-title">Choose a trial</h2>
            </div>

            <div className="echo-level-list" role="list">
              {levels.map((level) => {
                const isSelected = level.id === selectedLevelId;
                const isLocked = level.status === 'locked';

                return (
                  <button
                    key={level.id}
                    type="button"
                    className={`echo-level-item ${isSelected ? 'echo-level-item--selected' : ''}`}
                    disabled={isLocked}
                    onClick={() => !isLocked && onSelectLevel(level.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="echo-level-item__meta">
                      <span className="echo-status-chip">TRIAL {level.number}</span>
                      <span className="echo-status-chip echo-status-chip--muted">{level.difficulty}</span>
                    </span>
                    <span className="echo-level-item__body">
                      <span className="echo-level-item__title">{level.title}</span>
                      <span className="echo-level-item__objective">{level.objective}</span>
                    </span>
                    <span className={`echo-level-item__state ${isLocked ? 'echo-level-item__state--locked' : 'echo-level-item__state--active'}`}>
                      {isLocked ? 'LOCKED' : isSelected ? 'SELECTED' : 'READY'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="echo-level-actions">
              <button className="echo-button echo-button--primary" onClick={() => onSelectLevel(selectedLevelId)} data-testid="button-start-selected-trial">
                <span>START TRIAL</span>
                <span className="echo-button__arrow" aria-hidden="true">↗</span>
              </button>
              <button className="echo-text-button" onClick={onTitle} data-testid="button-back-to-title-from-levels">
                Back to Title
              </button>
            </div>
          </div>

          <div className="echo-monitor-panel echo-monitor-panel--selection" aria-hidden="true">
            <div className="echo-monitor-header">
              <span>FIG. {String(selectedLevelId.split('-').at(-1) ?? '01')} / CHAMBER PREVIEW</span>
              <span>PORTAL READOUT</span>
            </div>
            <div className="echo-monitor-screen echo-monitor-screen--selection">
              <div className="echo-monitor-grid" />
              <div className="echo-schematic">
                <span className="echo-schematic__platform echo-schematic__platform--a" />
                <span className="echo-schematic__platform echo-schematic__platform--b" />
                <span className="echo-schematic__platform echo-schematic__platform--c" />
                <span className="echo-schematic__runner" />
                <span className="echo-schematic__exit" />
              </div>
              <div className="echo-terminal-label echo-terminal-label--left">{levels.find((level) => level.id === selectedLevelId)?.title.toUpperCase() ?? 'TRIAL 01'}</div>
              <div className="echo-terminal-label echo-terminal-label--right">{levels.find((level) => level.id === selectedLevelId)?.difficulty ?? 'ENTRY'}</div>
            </div>
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
                  {completion && (
                    <div className="echo-victory-times" data-testid="victory-times">
                      <div>
                        <span>YOUR TIME</span>
                        <strong data-testid="text-your-time">{formatCompletionTime(completion.completionTimeMs)}</strong>
                      </div>
                      <div>
                        <span>BEST TIME</span>
                        <strong data-testid="text-best-time">{formatCompletionTime(completion.bestTimeMs)}</strong>
                      </div>
                    </div>
                  )}
                  {completion?.isNewBest && (
                    <p className="echo-new-best" data-testid="text-new-best">NEW BEST!</p>
                  )}
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
