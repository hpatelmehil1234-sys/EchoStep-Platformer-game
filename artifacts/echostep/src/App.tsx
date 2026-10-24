import { type ReactNode, useCallback, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import EchoStepShell from '@/components/EchoStepShell';
import PhaserGame from '@/components/PhaserGame';
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

function Home() {
  const [screen, setScreen] = useState<'title' | 'playing' | 'victory'>('title');
  const [runId, setRunId] = useState(1);
  const handleVictory = useCallback(() => setScreen('victory'), []);
  const handleRestart = useCallback(() => {
    setRunId((currentRun) => currentRun + 1);
    setScreen('playing');
  }, []);

  return (
    <EchoStepShell
      screen={screen}
      runId={runId}
      onStart={() => setScreen('playing')}
      onRestart={handleRestart}
      onTitle={() => setScreen('title')}
    >
      {screen !== 'title' && (
        <PhaserGame key={runId} onVictory={handleVictory} />
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
