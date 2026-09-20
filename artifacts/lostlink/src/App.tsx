import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Router as WouterRouter, Route, Switch, useLocation } from 'wouter';
import {
  AdminPage,
  ClaimsPage,
  DashboardPage,
  HandoverPage,
  LandingPage,
  MatchesPage,
  NotFoundPage,
  ReportFoundPage,
  ReportLostPage,
  VerificationPage,
} from '@/pages/lostlink-pages';

const queryClient = new QueryClient();

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/report-lost" component={ReportLostPage} />
        <Route path="/report-found" component={ReportFoundPage} />
        <Route path="/matches" component={MatchesPage} />
        <Route path="/claims" component={ClaimsPage} />
        <Route path="/verification/:id" component={VerificationPage} />
        <Route path="/handover/:id" component={HandoverPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </RoutedErrorBoundary>
  );
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