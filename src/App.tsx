import { lazy, Suspense, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { TopBar } from './components/TopBar';
import { Today } from './screens/Today';
import { Weeks } from './screens/Weeks';
import { Exercises } from './screens/Exercises';
import { Nutrition } from './screens/Nutrition';
import { clampDate, todayISO } from './lib/dates';
import { planEndDate, planStartDate } from './lib/planIndex';
import { TrackingProvider } from './lib/tracking';

const Tracking = lazy(() => import('./screens/Tracking').then((m) => ({ default: m.Tracking })));

export type Tab = 'today' | 'weeks' | 'tracking' | 'exercises' | 'nutrition';

const TAB_TITLES: Record<Tab, string> = {
  today: 'Heute',
  weeks: 'Wochen',
  tracking: 'Tracking',
  exercises: 'Übungen',
  nutrition: 'Ernährung'
};

function AppShell() {
  const [tab, setTab] = useState<Tab>('today');
  const [selectedDate, setSelectedDate] = useState(() => clampDate(todayISO(), planStartDate, planEndDate));

  function selectDayAndShow(date: string) {
    setSelectedDate(date);
    setTab('today');
  }

  return (
    <div className="min-h-screen bg-ink text-chalk font-body pb-24">
      <TopBar title={TAB_TITLES[tab]} />
      <main className="mx-auto max-w-2xl px-4 py-4">
        {tab === 'today' && <Today date={selectedDate} onChangeDate={setSelectedDate} />}
        {tab === 'weeks' && <Weeks onSelectDay={selectDayAndShow} />}
        {tab === 'tracking' && (
          <Suspense fallback={<p className="text-center text-muted text-sm py-10">Lädt…</p>}>
            <Tracking date={selectedDate} onChangeDate={setSelectedDate} />
          </Suspense>
        )}
        {tab === 'exercises' && <Exercises />}
        {tab === 'nutrition' && <Nutrition />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <TrackingProvider>
      <AppShell />
    </TrackingProvider>
  );
}
