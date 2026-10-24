import { type ReactNode, useCallback, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import EchoStepShell from '@/components/EchoStepShell';
import PhaserGame from '@/components/PhaserGame';
import type { LevelCompletion } from '@/game/levelTimes';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

export type LevelOption = {
  id: string;
  number: number;
  title: string;
  difficulty: string;
  objective: string;
  status: 'available' | 'locked';
};

const LEVEL_OPTIONS: LevelOption[] = [
  {
    id: 'trial-01',
    number: 1,
    title: 'Quiet Drift',
    difficulty: 'ENTRY',
    objective: 'Find the exit and avoid the chamber glare.',
    status: 'available',
  },
  {
    id: 'trial-02',
    number: 2,
    title: 'Relay Gap',
    difficulty: 'MID',
    objective: 'Cross the suspended crawlways and hold your momentum.',
    status: 'available',
  },
  {
    id: 'trial-03',
    number: 3,
    title: 'Heavy Echo',
    difficulty: 'ADV',
    objective: 'Use precise timing to leap between hazard lanes.',
    status: 'available',
  },
  {
    id: 'trial-04',
    number: 4,
    title: 'Exit Protocol',
    difficulty: 'FINAL',
    objective: 'Reach the final breach and complete the route.',
    status: 'locked',
  },
];

function Home() {
  const [screen, setScreen] = useState<'title' | 'level-select' | 'playing' | 'victory'>('title');
  const [selectedLevelId, setSelectedLevelId] = useState<string>(LEVEL_OPTIONS[0].id);
  const [runId, setRunId] = useState(1);
  const [completion, setCompletion] = useState<LevelCompletion | null>(null);
  const handleVictory = useCallback((result: LevelCompletion) => {
    setCompletion(result);
    setScreen('victory');
  }, []);
  const handleStart = useCallback(() => {
    setCompletion(null);
    setScreen('level-select');
  }, []);
  const handleSelectLevel = useCallback((levelId: string) => {
    setSelectedLevelId(levelId);
    setCompletion(null);
    setScreen('playing');
  }, []);
  const handleRestart = useCallback(() => {
    setRunId((currentRun) => currentRun + 1);
    setCompletion(null);
    setScreen('playing');
  }, []);
  const handleTitle = useCallback(() => {
    setCompletion(null);
    setScreen('title');
  }, []);

  return (
    <EchoStepShell
      screen={screen}
      runId={runId}
      completion={completion}
      levels={LEVEL_OPTIONS}
      selectedLevelId={selectedLevelId}
      onStart={handleStart}
      onSelectLevel={handleSelectLevel}
      onRestart={handleRestart}
      onTitle={handleTitle}
    >
      {screen === 'playing' && (
        <PhaserGame key={`${runId}-${selectedLevelId}`} onVictory={handleVictory} levelId={selectedLevelId} />
      )}
    </EchoStepShell>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
