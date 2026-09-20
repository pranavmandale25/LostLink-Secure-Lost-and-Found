import { type ChangeEvent, type FormEvent, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useCreateClaim,
  useCreateHandover,
  useCreateItem,
  useCreateMatch,
  useGetAdminMetrics,
  useGetDashboard,
  useGetItem,
  useHealthCheck,
  useListClaims,
  useListItems,
  useListMatches,
  useVerifyClaim,
  getGetAdminMetricsQueryKey,
  getGetDashboardQueryKey,
  getGetItemQueryKey,
  getListClaimsQueryKey,
  getListItemsQueryKey,
  getListMatchesQueryKey,
} from '@workspace/api-client-react';
import { Link, useLocation, useParams } from 'wouter';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  Flag,
  HandHeart,
  Info,
  LockKeyhole,
  MapPin,
  PackageCheck,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from 'lucide-react';
import {
  AppShell,
  DetailLabel,
  EmptyState,
  ErrorState,
  InputField,
  ItemThumbnail,
  MetricCard,
  PageTitle,
  PrimaryButton,
  SectionRule,
  SecondaryButton,
  SkeletonRows,
  StatusPill,
  TrustStrip,
} from '@/components/lostlink-ui';

const fmtDate = (value?: string) => {
  if (!value) return 'Recently';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsed);
};
const toneForStatus = (status?: string) => {
  if (!status) return 'slate' as const;
  if (['VERIFIED', 'RESOLVED', 'FOUND', 'COMPLETED', 'PASSED'].includes(status)) return 'teal' as const;
  if (['PENDING', 'POTENTIAL', 'MATCHED', 'ARRANGED', 'VERIFICATION_PENDING'].includes(status)) return 'amber' as const;
  if (['FAILED'].includes(status)) return 'red' as const;
  return 'slate' as const;
};

function BrandHeader() {
  return <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><Link href="/" className="flex items-center gap-2.5" data-testid="link-public-logo"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><HandHeart size={19} /></span><span className="font-display text-[17px] font-extrabold tracking-tight">LostLink</span></Link><div className="flex items-center gap-3"><Link href="/dashboard" className="hidden text-sm font-bold text-muted-foreground hover:text-primary sm:block" data-testid="link-public-dashboard">Open dashboard</Link><Link href="/report-lost" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:shadow-lift" data-testid="link-public-report">Report an item</Link></div></header>;
}

export function LandingPage() {
  const health = useHealthCheck();
  const itemsQuery = useListItems({ type: 'found' });
  const foundCount = itemsQuery.data?.length ?? 0;
  return <div className="min-h-[100dvh] overflow-hidden bg-background">
    <BrandHeader />
    <main>
      <section className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.03fr_.97fr] lg:items-center lg:pb-24">
        <div className="relative z-10 animate-rise">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> A campus service for getting things back</div>
          <h1 className="max-w-2xl font-display text-[clamp(3.2rem,7vw,6.4rem)] font-extrabold leading-[.94] tracking-[-.075em] text-foreground">Lost is a moment.<br /><span className="text-primary">Found is a feeling.</span></h1>
          <p className="mt-7 max-w-lg text-[17px] leading-8 text-muted-foreground">LostLink gives your campus a thoughtful, secure way to report, match, and return belongings. Simple to use. Careful with what matters.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/report-lost" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lift hover:-translate-y-0.5" data-testid="link-hero-lost">I lost something <ArrowRight size={17} /></Link><Link href="/report-found" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-bold hover:-translate-y-0.5 hover:border-primary/40" data-testid="link-hero-found">I found something</Link></div>
          <div className="mt-10 flex items-center gap-3 text-xs text-muted-foreground"><span className={`h-2 w-2 rounded-full ${health.isError ? 'bg-destructive' : 'bg-primary'}`} /> {health.isError ? 'Service connection needs attention' : 'LostLink service is online'} <span className="text-border">/</span> Built for campus care</div>
        </div>
        <div className="relative animate-rise animate-rise-1">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative rounded-[2rem] border border-border bg-card p-3 shadow-lift">
            <div className="grid-paper relative overflow-hidden rounded-[1.5rem] bg-secondary/40 p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-border/70 pb-5"><div><p className="font-mono-app text-[9px] uppercase tracking-[.18em] text-primary">Recovery board</p><p className="mt-1 font-display text-xl font-extrabold">The right things, right place.</p></div><div className="rounded-xl bg-card p-2.5 text-primary shadow-sm"><ShieldCheck size={21} /></div></div>
              <div className="mt-5 space-y-3">
                {[['Slate backpack', 'Found near North Quad', 'FOUND', 'bg-primary/10 text-primary'], ['Silver water bottle', 'Potential match · 84%', 'MATCHED', 'bg-accent/20 text-amber-800'], ['Student ID holder', 'Identity verified', 'VERIFIED', 'bg-sky-100 text-sky-800']].map(([name, detail, status, cls], index) => <div key={name} className={`flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3.5 shadow-sm animate-rise animate-rise-${index + 1}`}><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cls}`}><PackageCheck size={18} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{name}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{detail}</p></div><span className={`hidden rounded-full px-2 py-1 font-mono-app text-[9px] font-semibold sm:block ${cls}`}>{status}</span></div>)}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-sidebar px-4 py-3.5 text-sidebar-foreground"><div><p className="text-[11px] font-semibold text-sidebar-foreground/60">Community found items</p><p className="mt-1 font-display text-2xl font-extrabold text-white">{foundCount || '—'}</p></div><div className="h-12 w-12 rounded-full border border-sidebar-primary/30 p-1.5"><div className="flex h-full items-center justify-center rounded-full bg-sidebar-primary/15 text-sidebar-primary"><UsersRound size={19} /></div></div></div>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 sm:px-8"><TrustStrip /></div>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"><div className="max-w-xl"><p className="font-mono-app text-[10px] font-semibold uppercase tracking-[.18em] text-primary">A gentler workflow</p><h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-.05em] sm:text-5xl">Clear steps. Fewer awkward questions.</h2></div><div className="mt-12 grid gap-4 md:grid-cols-3">{[['01', 'Tell us what happened', 'A quick report captures the useful details without making you write an essay.', Flag], ['02', 'Let the service look', 'Potential matches are surfaced using visible details — not private ownership clues.', Search], ['03', 'Prove it is yours', 'A private verification step keeps well-intentioned claims from becoming guesswork.', LockKeyhole]].map(([number, title, body, Icon]) => <div key={number as string} className="border-l-2 border-primary/25 pl-5"><span className="font-mono-app text-xs text-primary">{number as string}</span><Icon className="mt-7 text-primary" size={21} /><h3 className="mt-5 font-display text-xl font-extrabold">{title as string}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{body as string}</p></div>)}</div></section>
      <section className="border-y border-border bg-secondary/55"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-primary">Ready when you are</p><h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-.04em]">Start a report in under two minutes.</h2></div><div className="flex flex-wrap gap-3"><Link href="/report-lost" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground" data-testid="link-bottom-lost">Report lost <ArrowRight size={16} /></Link><Link href="/report-found" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold" data-testid="link-bottom-found">Report found</Link></div></div></section>
    </main>
    <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8"><span className="font-display font-bold text-foreground">LostLink</span><span>For the campus community · Careful by design</span></footer>
  </div>;
}

export function DashboardPage() {
  const query = useGetDashboard();
  const dashboard = query.data;
  if (query.isLoading) return <AppShell><PageTitle eyebrow="Your recovery desk" title="Good to see you, Avery." description="A calm view of what you reported and what needs your attention." /><SkeletonRows count={4} /></AppShell>;
  if (query.isError || !dashboard) return <AppShell><PageTitle title="Your recovery desk" /><ErrorState onRetry={() => query.refetch()} /></AppShell>;
  const stats = dashboard.stats;
  return <AppShell><PageTitle eyebrow="Your recovery desk" title="Good to see you, Avery." description="A calm view of what you reported and what needs your attention." action={<Link href="/report-lost" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:-translate-y-0.5" data-testid="link-dashboard-report"><Plus size={16} /> New report</Link>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[[ 'Reports made', stats.reported, 'Across lost and found', FileCheck2, 'teal'], ['Potential matches', stats.matches, 'Need a closer look', Search, 'amber'], ['Pending claims', stats.pendingClaims, 'Awaiting verification', Clock3, 'blue'], ['Returned safely', stats.returned, 'Closed with care', CheckCircle2, 'slate']].map(([label, value, detail, Icon, accent]) => <MetricCard key={label as string} label={label as string} value={value as number} detail={detail as string} icon={Icon as typeof FileCheck2} accent={accent as 'teal'} />)}</div>
    <div className="mt-10 grid gap-8 xl:grid-cols-[1.15fr_.85fr]"><section><SectionRule>Recent reports</SectionRule>{dashboard.recentItems?.length ? <div className="space-y-3">{dashboard.recentItems.map((item) => <Link href={item.type === 'lost' ? '/matches' : '/claims'} key={item.id} className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft hover:-translate-y-0.5 hover:border-primary/30" data-testid={`card-recent-item-${item.id}`}><ItemThumbnail imageUrl={item.imageUrl} type={item.type} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="truncate font-bold">{item.name}</p><StatusPill label={item.status.replaceAll('_', ' ')} tone={toneForStatus(item.status)} /></div><p className="mt-1 text-xs text-muted-foreground">{item.category} · {item.location} · {fmtDate(item.createdAt)}</p></div><ChevronRight size={17} className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" /></Link>)}</div> : <EmptyState title="Your recovery desk is quiet" description="Create your first report and we will keep an eye out for a connection." action={<Link href="/report-lost" className="text-sm font-bold text-primary" data-testid="link-empty-report">Make a report <ArrowRight className="ml-1 inline" size={14} /></Link>} />}</section>
      <section><SectionRule>Latest activity</SectionRule><div className="rounded-2xl border border-border bg-card p-5 shadow-soft">{dashboard.recentActivity?.length ? <div className="space-y-5">{dashboard.recentActivity.map((activity) => <div key={activity.id} className="flex gap-3" data-testid={`activity-${activity.id}`}><span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Activity size={14} /></span><div><p className="text-sm font-bold">{activity.title}</p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">{activity.description}</p><p className="mt-1 font-mono-app text-[10px] text-muted-foreground/70">{fmtDate(activity.timestamp)}</p></div></div>)}</div> : <p className="py-5 text-sm text-muted-foreground">New activity will appear here as your reports move forward.</p>}</div></section></div>
  </AppShell>;
}

type ReportMode = 'lost' | 'found';
function ReportPage({ mode }: { mode: ReportMode }) {
  const [, setLocation] = useLocation();
  const client = useQueryClient();
  const mutation = useCreateItem();
  const [form, setForm] = useState({ name: '', category: '', brand: '', model: '', color: '', location: '', date: '', time: '', description: '', imageUrl: '', privateClues: '' });
  const [imageError, setImageError] = useState('');
  const update = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));
  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Images must be 5 MB or smaller.');
      return;
    }
    setImageError('');
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, imageUrl: String(reader.result ?? '') }));
    reader.readAsDataURL(file);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ data: { ...form, type: mode, privateClues: form.privateClues.split('\n').map((clue) => clue.trim()).filter(Boolean) } }, { onSuccess: () => { client.invalidateQueries({ queryKey: getListItemsQueryKey() }); client.invalidateQueries({ queryKey: getGetDashboardQueryKey() }); setLocation('/dashboard'); } });
  };
  const isLost = mode === 'lost';
  return <AppShell><PageTitle eyebrow={isLost ? 'Start a recovery' : 'Help return something'} title={isLost ? 'Report a lost item' : 'Report a found item'} description={isLost ? 'Give us the visible details first. Then add a private clue only the real owner could know.' : 'A few clear details help us connect this item with the right person.'} />
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_330px]"><div className="space-y-7"><section className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-7"><SectionRule>What should the community notice?</SectionRule><div className="grid gap-5 sm:grid-cols-2"><InputField label="Item name" value={form.name} onChange={update('name')} placeholder="e.g. Canvas backpack" required testId="input-item-name" /><InputField label="Category" value={form.category} onChange={update('category')} placeholder="e.g. Bags, electronics" required testId="input-item-category" /><InputField label="Brand" value={form.brand} onChange={update('brand')} placeholder="e.g. Fjällräven" required testId="input-item-brand" /><InputField label="Model or series" value={form.model} onChange={update('model')} placeholder="Optional" testId="input-item-model" /><InputField label="Color" value={form.color} onChange={update('color')} placeholder="e.g. Navy blue" required testId="input-item-color" /><InputField label={isLost ? 'Where was it last seen?' : 'Where was it found?'} value={form.location} onChange={update('location')} placeholder="Building, room, or campus area" required testId="input-item-location" /></div></section>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-7"><SectionRule>When and what did it look like?</SectionRule><div className="grid gap-5 sm:grid-cols-2"><InputField label="Date" value={form.date} onChange={update('date')} type="date" required testId="input-item-date" /><InputField label="Approximate time" value={form.time} onChange={update('time')} type="time" required testId="input-item-time" /></div><div className="mt-5"><InputField label="Description" value={form.description} onChange={update('description')} placeholder="Anything helpful that is safe to share publicly" multiline required testId="input-item-description" /></div><div className="mt-5"><label className="block"><span className="mb-1.5 flex items-center gap-1 text-xs font-bold">Upload an image</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} className="block w-full rounded-xl border border-dashed border-input bg-background px-3.5 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-xs file:font-bold file:text-primary" data-testid="input-item-file" /><span className="mt-1.5 block text-[11px] leading-4 text-muted-foreground">Optional. PNG, JPG, or WebP up to 5 MB. Images are visible only on the report.</span>{imageError && <span className="mt-1.5 block text-[11px] font-semibold text-destructive">{imageError}</span>}</label></div><div className="mt-5"><InputField label="Image URL (optional)" value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl} onChange={update('imageUrl')} placeholder="Or paste a photo link" hint="Only share an image you are comfortable making visible to the campus community." testId="input-item-image-url" /></div></section>
      <section className="rounded-2xl border border-primary/20 bg-primary/[.035] p-5 sm:p-7"><div className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><LockKeyhole size={18} /></span><div className="w-full"><SectionRule>Private ownership clues</SectionRule><p className="mb-4 max-w-xl text-sm leading-6 text-muted-foreground">{isLost ? 'These clues never appear on public item views. Keep them specific: a sticker under the case, a nick on a corner, or what is inside a pocket.' : 'If you know details that could identify the owner, record them here. We will keep them private and use them only during a claim.'}</p><InputField label="One clue per line" value={form.privateClues} onChange={update('privateClues')} placeholder="e.g. Small constellation sticker inside the flap" multiline hint="Optional, but private clues make ownership verification much safer." testId="input-private-clues" /></div></div></section>
      {mutation.isError && <ErrorState onRetry={() => mutation.reset()} label="This report could not be sent yet." />}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Link href="/dashboard" className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-secondary" data-testid="link-cancel-report">Cancel</Link><PrimaryButton type="submit" disabled={mutation.isPending} testId="button-submit-report">{mutation.isPending ? 'Saving report…' : `Submit ${isLost ? 'lost' : 'found'} report`} <ArrowRight size={16} /></PrimaryButton></div>
    </div><aside className="h-fit rounded-2xl border border-border bg-sidebar p-6 text-sidebar-foreground shadow-soft lg:sticky lg:top-8"><ShieldCheck className="text-sidebar-primary" size={22} /><h2 className="mt-5 font-display text-xl font-extrabold text-white">Good details create good reunions.</h2><p className="mt-2 text-sm leading-6 text-sidebar-foreground/65">Public details help the right people notice. Private clues help us protect the handoff.</p><div className="mt-7 space-y-4 border-t border-sidebar-border pt-5">{['Visible details are safe to share', 'Private clues stay out of public views', 'You can update the next step from your desk'].map((text) => <div key={text} className="flex gap-2.5 text-xs leading-5"><Check size={15} className="mt-0.5 shrink-0 text-sidebar-primary" />{text}</div>)}</div>{!isLost && <div className="mt-6 rounded-xl border border-accent/30 bg-accent/10 p-3.5 text-xs leading-5 text-amber-100"><ShieldAlert size={16} className="mb-2 text-accent" /><b>Found a device?</b> Do not unlock it or browse its contents. Record only visible identifying details.</div>}</aside></form>
  </AppShell>;
}

export function ReportLostPage() { return <ReportPage mode="lost" />; }
export function ReportFoundPage() { return <ReportPage mode="found" />; }

export function MatchesPage() {
  const matchesQuery = useListMatches();
  const itemsQuery = useListItems();
  const createMatch = useCreateMatch();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [selectedFoundId, setSelectedFoundId] = useState('');
  const [lostId, setLostId] = useState('');
  const [showRunner, setShowRunner] = useState(false);
  const client = useQueryClient();
  const selected = matchesQuery.data?.find((match) => match.id === selectedMatch);
  const foundItems = itemsQuery.data?.filter((item) => item.type === 'found') ?? [];
  const lostItems = itemsQuery.data?.filter((item) => item.type === 'lost') ?? [];
  const itemDetail = useGetItem(selectedFoundId, { query: { enabled: !!selectedFoundId, queryKey: getGetItemQueryKey(selectedFoundId) } });
  const submitMatch = () => { if (!lostId || !selectedFoundId) return; createMatch.mutate({ data: { lostItemId: lostId, foundItemId: selectedFoundId } }, { onSuccess: () => { setShowRunner(false); client.invalidateQueries({ queryKey: getListMatchesQueryKey() }); } }); };
  if (matchesQuery.isLoading) return <AppShell><PageTitle eyebrow="Connections" title="Potential matches" /><SkeletonRows count={4} /></AppShell>;
  if (matchesQuery.isError) return <AppShell><PageTitle title="Potential matches" /><ErrorState onRetry={() => matchesQuery.refetch()} /></AppShell>;
  return <AppShell><PageTitle eyebrow="Connections" title="Potential matches" description="A match is an invitation to look closer, not proof of ownership." action={<PrimaryButton onClick={() => setShowRunner(!showRunner)} testId="button-run-match"><Sparkles size={16} /> Find a connection</PrimaryButton>} />
    {showRunner && <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/[.035] p-5 sm:p-6"><div className="flex items-start justify-between"><div><h2 className="font-display text-lg font-extrabold">Find a connection</h2><p className="mt-1 text-sm text-muted-foreground">Choose one lost and one found report. Only public details are compared.</p></div><button onClick={() => setShowRunner(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary" data-testid="button-close-match-runner"><X size={17} /></button></div><div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end"><label className="block"><span className="mb-1.5 block text-xs font-bold">Lost report</span><select value={lostId} onChange={(event) => setLostId(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid="select-match-lost"><option value="">Select a lost item</option>{lostItems.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.color}</option>)}</select></label><label className="block"><span className="mb-1.5 block text-xs font-bold">Found report</span><select value={selectedFoundId} onChange={(event) => setSelectedFoundId(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid="select-match-found"><option value="">Select a found item</option>{foundItems.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.color}</option>)}</select></label><PrimaryButton onClick={submitMatch} disabled={!lostId || !selectedFoundId || createMatch.isPending} testId="button-submit-match">{createMatch.isPending ? 'Comparing…' : 'Compare reports'}</PrimaryButton></div>{createMatch.isError && <p className="mt-3 text-sm font-semibold text-destructive">We could not compare those reports. Try again.</p>}</div>}
    {!matchesQuery.data?.length ? <EmptyState icon={Search} title="No potential matches yet" description="As reports come in, LostLink will surface connections here. You can also compare two reports manually." action={<PrimaryButton onClick={() => setShowRunner(true)} testId="button-empty-match">Find a connection</PrimaryButton>} /> : <div className="grid gap-4">{matchesQuery.data.map((match, index) => <button key={match.id} onClick={() => { setSelectedMatch(match.id); setSelectedFoundId(match.foundItem.id); }} className={`group w-full rounded-2xl border bg-card p-5 text-left shadow-soft hover:-translate-y-0.5 hover:border-primary/35 ${selectedMatch === match.id ? 'border-primary/50 ring-4 ring-primary/5' : 'border-border'}`} data-testid={`card-match-${match.id}`}><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="font-mono-app text-[10px] text-muted-foreground">0{index + 1}</span><div><p className="font-display text-base font-extrabold">{match.lostItem.name} <span className="font-sans text-muted-foreground">↔</span> {match.foundItem.name}</p><p className="mt-1 text-xs text-muted-foreground">{match.lostItem.location} · {match.foundItem.location}</p></div></div><div className="flex items-center gap-3"><span className="rounded-xl bg-primary/10 px-3 py-2 font-display text-lg font-extrabold text-primary">{Math.round(match.similarity)}%</span><StatusPill label={match.status.replaceAll('_', ' ')} tone={toneForStatus(match.status)} /></div></div><div className="mt-5 flex flex-wrap gap-2">{match.factors.map((factor) => <span key={factor} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">{factor}</span>)}</div></button>)}</div>}
    {selected && <div className="fixed inset-0 z-40 flex items-end justify-center bg-sidebar/35 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-lift sm:rounded-3xl sm:p-8"><div className="flex items-start justify-between"><div><p className="font-mono-app text-[10px] uppercase tracking-[.16em] text-primary">Connection review</p><h2 className="mt-2 font-display text-2xl font-extrabold">{selected.lostItem.name} and {selected.foundItem.name}</h2></div><button onClick={() => setSelectedMatch(null)} className="rounded-xl p-2 text-muted-foreground hover:bg-secondary" data-testid="button-close-match-detail"><X size={19} /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-border p-4"><p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Lost report</p><div className="flex items-center gap-3"><ItemThumbnail imageUrl={selected.lostItem.imageUrl} type="lost" /><div><p className="font-bold">{selected.lostItem.name}</p><p className="text-xs text-muted-foreground">{selected.lostItem.color} · {selected.lostItem.location}</p></div></div></div><div className="rounded-2xl border border-border p-4"><p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Found report</p><div className="flex items-center gap-3"><ItemThumbnail imageUrl={selected.foundItem.imageUrl} type="found" /><div><p className="font-bold">{selected.foundItem.name}</p><p className="text-xs text-muted-foreground">{selected.foundItem.color} · {selected.foundItem.location}</p></div></div></div></div><div className="mt-5 rounded-2xl bg-secondary/70 p-4"><p className="text-sm font-bold">Public details line up</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{selected.factors.join(', ')}. Private ownership clues are intentionally not shown here.</p></div>{itemDetail.isLoading && <div className="mt-4 skeleton h-14 w-full" />}{itemDetail.data && <div className="mt-4 grid gap-4 rounded-2xl border border-border p-4 sm:grid-cols-3"><DetailLabel label="Category" value={itemDetail.data.category} /><DetailLabel label="Brand" value={itemDetail.data.brand} /><DetailLabel label="Reported" value={fmtDate(itemDetail.data.createdAt)} /></div>}<div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button onClick={() => setSelectedMatch(null)} className="rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-secondary" data-testid="button-dismiss-match">Not now</button><Link href="/claims" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground" data-testid={`link-claim-match-${selected.id}`}>Start a claim <ArrowRight size={16} /></Link></div></div></div>}
  </AppShell>;
}

export function ClaimsPage() {
  const query = useListClaims({ query: { queryKey: getListClaimsQueryKey() } });
  const items = useListItems({ type: 'found' });
  const createClaim = useCreateClaim();
  const client = useQueryClient();
  const [claimItem, setClaimItem] = useState('');
  const [evidence, setEvidence] = useState('');
  const [email, setEmail] = useState('');
  const submit = () => { if (!claimItem || !evidence.trim()) return; createClaim.mutate({ data: { itemId: claimItem, evidence, identityEmail: email || undefined } }, { onSuccess: () => { setClaimItem(''); setEvidence(''); setEmail(''); client.invalidateQueries({ queryKey: getListClaimsQueryKey() }); client.invalidateQueries({ queryKey: getListItemsQueryKey() }); client.invalidateQueries({ queryKey: getGetDashboardQueryKey() }); } }); };
  if (query.isLoading) return <AppShell><PageTitle eyebrow="Ownership care" title="Claims" /><SkeletonRows count={4} /></AppShell>;
  if (query.isError) return <AppShell><PageTitle title="Claims" /><ErrorState onRetry={() => query.refetch()} /></AppShell>;
  return <AppShell><PageTitle eyebrow="Ownership care" title="Claims" description="Identity and ownership are separate checks. Both matter before a handover." />
    <div className="grid gap-8 xl:grid-cols-[1.1fr_.9fr]"><section><SectionRule>Claims in review</SectionRule>{query.data?.length ? <div className="space-y-3">{query.data.map((claim) => <div key={claim.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft" data-testid={`card-claim-${claim.id}`}><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-center gap-3"><ItemThumbnail imageUrl={claim.item.imageUrl} type={claim.item.type} /><div><p className="font-display text-base font-extrabold">{claim.item.name}</p><p className="mt-1 text-xs text-muted-foreground">Claim by {claim.claimantName} · {fmtDate(claim.createdAt)}</p></div></div><StatusPill label={claim.verificationStatus.replaceAll('_', ' ')} tone={toneForStatus(claim.verificationStatus)} /></div><div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2"><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Identity check</span><span className="flex items-center gap-1.5 font-bold">{claim.identityStatus === 'VERIFIED' ? <CheckCircle2 size={14} className="text-primary" /> : <Clock3 size={14} className="text-amber-700" />}{claim.identityStatus.replaceAll('_', ' ')}</span></div><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Ownership evidence</span><span className="font-bold text-foreground">{claim.evidenceMatched?.length ? `${claim.evidenceMatched.length} clues matched` : 'Pending'}</span></div></div><Link href={`/verification/${claim.id}`} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline" data-testid={`link-claim-verification-${claim.id}`}>Open verification <ArrowRight size={13} /></Link></div>)}</div> : <EmptyState icon={FileCheck2} title="No claims are waiting" description="When someone claims a found item, the careful part happens here." />}</section>
      <section className="h-fit rounded-2xl border border-primary/20 bg-primary/[.035] p-5 sm:p-6"><div className="flex items-center gap-2 text-primary"><Plus size={17} /><h2 className="font-display text-lg font-extrabold">Claim a found item</h2></div><p className="mt-2 text-sm leading-6 text-muted-foreground">Tell us something private about the item. Never include a password or sensitive account detail.</p><div className="mt-5 space-y-4"><label className="block"><span className="mb-1.5 block text-xs font-bold">Found item</span><select value={claimItem} onChange={(event) => setClaimItem(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid="select-claim-item"><option value="">Select an item</option>{items.data?.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.location}</option>)}</select></label><InputField label="Identity email" value={email} onChange={setEmail} type="email" placeholder="you@campus.edu" hint="Optional; helps a moderator confirm your campus identity." testId="input-claim-email" /><InputField label="Private evidence" value={evidence} onChange={setEvidence} placeholder="What would only the true owner know?" multiline required testId="input-claim-evidence" /><PrimaryButton onClick={submit} disabled={!claimItem || !evidence.trim() || createClaim.isPending} className="w-full" testId="button-submit-claim">{createClaim.isPending ? 'Sending claim…' : 'Submit private claim'} <ArrowRight size={16} /></PrimaryButton>{createClaim.isSuccess && <p className="flex items-center gap-2 text-xs font-bold text-primary" data-testid="status-claim-sent"><CheckCircle2 size={14} /> Claim received for careful review.</p>}{createClaim.isError && <p className="text-xs font-bold text-destructive" data-testid="status-claim-error">We could not submit that claim yet.</p>}</div></section>
    </div></AppShell>;
}

export function VerificationPage() {
  const { id = '' } = useParams<{ id: string }>();
  const query = useListClaims();
  const verify = useVerifyClaim();
  const claim = query.data?.find((entry) => entry.id === id);
  const [evidence, setEvidence] = useState('');
  const [result, setResult] = useState<{ status: string; message: string; evidenceMatched: string[] } | null>(null);
  const submit = () => { if (!evidence.trim()) return; verify.mutate({ id, data: { evidence } }, { onSuccess: (response) => setResult(response) }); };
  return <AppShell><Link href="/claims" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary" data-testid="link-back-claims"><ArrowLeft size={16} /> Back to claims</Link><div className="mx-auto max-w-3xl"><div className="mb-8"><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-primary">Private ownership check</p><h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-.05em]">Does this belong to you?</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">This is the part the public never sees. Share a detail that proves your connection without sharing a password or full account information.</p></div><div className="grid gap-5 md:grid-cols-[.8fr_1.2fr]"><div className="rounded-2xl border border-border bg-card p-5 shadow-soft"><LockKeyhole className="text-primary" size={21} /><p className="mt-5 font-display text-xl font-extrabold">{claim?.item.name || 'Claim verification'}</p><p className="mt-1 text-sm text-muted-foreground">{claim?.item.category || 'A protected item record'}</p><div className="mt-6 space-y-4 border-t border-border pt-5"><DetailLabel label="Claimant" value={claim?.claimantName} /><DetailLabel label="Identity status" value={claim?.identityStatus?.replaceAll('_', ' ')} /><DetailLabel label="Claim created" value={fmtDate(claim?.createdAt)} /></div></div><div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-7"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck size={18} /></span><div><h2 className="font-display text-lg font-extrabold">Your private evidence</h2><p className="text-xs text-muted-foreground">Only the service team can read this.</p></div></div><div className="mt-6"><InputField label="Ownership detail" value={evidence} onChange={setEvidence} placeholder="Describe a hidden mark, contents, or unique detail" multiline required hint="Be specific enough to distinguish this item from similar ones." testId="input-verification-evidence" /></div>{verify.isError && <p className="mt-4 text-sm font-semibold text-destructive" data-testid="status-verification-error">That evidence could not be submitted. Please try again.</p>}{result && <div className={`mt-5 rounded-2xl border p-4 ${result.status === 'PASSED' ? 'border-primary/25 bg-primary/5' : 'border-accent/35 bg-accent/10'}`} data-testid="verification-result"><div className="flex items-start gap-3">{result.status === 'PASSED' ? <CheckCircle2 className="text-primary" size={19} /> : <Info className="text-amber-800" size={19} />}<div><p className="font-bold">{result.status === 'PASSED' ? 'Ownership evidence matched' : 'A little more review is needed'}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{result.message}</p>{result.evidenceMatched.length > 0 && <p className="mt-2 text-xs font-bold text-primary">{result.evidenceMatched.length} private clue(s) matched.</p>}{result.status === 'PASSED' && claim && <Link href={`/handover/${claim.item.id}`} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline" data-testid="link-arrange-handover">Arrange a safe handover <ArrowRight size={13} /></Link>}</div></div></div>}<div className="mt-6 flex justify-end"><PrimaryButton onClick={submit} disabled={!evidence.trim() || verify.isPending} testId="button-submit-verification">{verify.isPending ? 'Checking evidence…' : 'Submit for verification'} <ArrowRight size={16} /></PrimaryButton></div></div></div></div></AppShell>;
}

export function HandoverPage() {
  const { id = '' } = useParams<{ id: string }>();
  const query = useListItems();
  const create = useCreateHandover();
  const item = query.data?.find((entry) => entry.id === id);
  const [note, setNote] = useState('');
  const [handover, setHandover] = useState<{ id: string; status: string; nextStep: string } | null>(null);
  const arrange = () => create.mutate({ data: { itemId: id, action: handover ? 'CONFIRM' : 'ARRANGE', note: note || undefined } }, { onSuccess: (response) => setHandover(response) });
  return <AppShell><Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary" data-testid="link-back-dashboard"><ArrowLeft size={16} /> Back to overview</Link><div className="mx-auto max-w-3xl"><PageTitle eyebrow="The final mile" title={handover?.status === 'COMPLETED' ? 'Handover confirmed.' : 'Make the handoff safe.'} description={handover?.nextStep || 'Choose a public campus location and keep the exchange simple. LostLink records the next step, not your private conversation.'} /><div className="grid gap-5 md:grid-cols-[.8fr_1.2fr]"><div className="rounded-2xl border border-border bg-card p-5 shadow-soft"><PackageCheck className="text-primary" size={21} /><h2 className="mt-5 font-display text-xl font-extrabold">{item?.name || 'Verified item'}</h2><p className="mt-1 text-sm text-muted-foreground">{item?.brand} · {item?.color}</p><div className="mt-6 space-y-4 border-t border-border pt-5"><DetailLabel label="Status" value={item?.status?.replaceAll('_', ' ')} /><DetailLabel label="Last known place" value={item?.location} /></div></div><div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-7"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><MapPin size={18} /></span><div><h2 className="font-display text-lg font-extrabold">{handover ? 'Confirm the return' : 'Arrange a safe meeting'}</h2><p className="text-xs text-muted-foreground">Use a staffed, public campus location.</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-3">{[['Campus service desk', 'Staffed'], ['Library entrance', 'Public'], ['Student center', 'Visible']].map(([name, detail]) => <button key={name} onClick={() => setNote(`${name} — ${detail}`)} className={`rounded-xl border p-3 text-left hover:border-primary/40 hover:bg-primary/5 ${note.startsWith(name) ? 'border-primary bg-primary/5' : 'border-border'}`} data-testid={`button-location-${name.toLowerCase().replaceAll(' ', '-')}`}><p className="text-xs font-bold">{name}</p><p className="mt-1 text-[10px] text-muted-foreground">{detail}</p></button>)}</div><div className="mt-5"><InputField label="Handover note" value={note} onChange={setNote} placeholder="Add a location or timing note" multiline testId="input-handover-note" /></div>{create.isError && <p className="mt-4 text-sm font-semibold text-destructive">We could not save this handover yet.</p>}{handover && <div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4" data-testid="handover-result"><CheckCircle2 className="mt-0.5 text-primary" size={18} /><div><p className="font-bold">Handover {handover.status.toLowerCase()}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{handover.nextStep}</p></div></div>}<div className="mt-6 flex justify-end"><PrimaryButton onClick={arrange} disabled={create.isPending} testId="button-confirm-handover">{create.isPending ? 'Saving…' : handover ? 'Confirm handover' : 'Arrange handover'} <ArrowRight size={16} /></PrimaryButton></div></div></div></div></AppShell>;
}

export function AdminPage() {
  const query = useGetAdminMetrics({ query: { queryKey: getGetAdminMetricsQueryKey() } });
  if (query.isLoading) return <AppShell><PageTitle eyebrow="Stewardship" title="Moderation overview" /><SkeletonRows count={4} /></AppShell>;
  if (query.isError || !query.data) return <AppShell><PageTitle title="Moderation overview" /><ErrorState onRetry={() => query.refetch()} /></AppShell>;
  const metrics = query.data;
  const maxTrend = Math.max(...metrics.trend.map((entry) => entry.lost + entry.found), 1);
  return <AppShell><PageTitle eyebrow="Stewardship" title="Moderation overview" description="A quiet operational view for keeping the recovery service healthy." action={<div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-bold text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary" /> Live service data</div>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{[['Lost reports', metrics.totals.lost, Flag, 'amber'], ['Found reports', metrics.totals.found, PackageCheck, 'teal'], ['Matches', metrics.totals.matches, Search, 'blue'], ['Pending review', metrics.totals.pending, Clock3, 'amber'], ['Returned', metrics.totals.returned, CheckCircle2, 'slate']].map(([label, value, Icon, accent]) => <MetricCard key={label as string} label={label as string} value={value as number} detail="Across the campus service" icon={Icon as typeof BarChart3} accent={accent as 'teal'} />)}</div><div className="mt-9 grid gap-8 xl:grid-cols-[1.1fr_.9fr]"><section className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-7"><SectionRule>Report activity</SectionRule><div className="mt-8 flex h-56 items-end gap-2 sm:gap-4">{metrics.trend.map((entry) => { const total = entry.lost + entry.found; const height = Math.max((total / maxTrend) * 100, 8); return <div key={entry.label} className="flex flex-1 flex-col items-center gap-2" data-testid={`bar-trend-${entry.label}`}><span className="font-mono-app text-[10px] text-muted-foreground">{total}</span><div className="flex h-40 w-full items-end justify-center gap-1"><div className="w-1/2 max-w-5 rounded-t-md bg-primary/75" style={{ height: `${Math.max((entry.lost / maxTrend) * 100, 4)}%` }} /><div className="w-1/2 max-w-5 rounded-t-md bg-accent" style={{ height: `${Math.max((entry.found / maxTrend) * 100, 4)}%` }} /></div><span className="font-mono-app text-[10px] text-muted-foreground">{entry.label}</span></div> })}</div><div className="mt-5 flex gap-5 text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" /> Lost</span><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> Found</span></div></section><section className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-7"><SectionRule>What turns up most</SectionRule><div className="mt-6 space-y-5">{metrics.categories.map((category, index) => { const max = Math.max(...metrics.categories.map((entry) => entry.count), 1); return <div key={category.category} data-testid={`row-category-${category.category}`}><div className="mb-2 flex justify-between text-sm"><span className="font-bold">{category.category}</span><span className="font-mono-app text-xs text-muted-foreground">{category.count}</span></div><div className="h-2 overflow-hidden rounded-full bg-secondary"><div className={`h-full rounded-full ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-accent' : 'bg-sky-400'}`} style={{ width: `${(category.count / max) * 100}%` }} /></div></div> })}</div></section></div></AppShell>;
}

export function NotFoundPage() {
  return <div className="grid min-h-[100dvh] place-items-center px-6"><div className="max-w-md text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Search size={25} /></div><p className="mt-6 font-mono-app text-[10px] uppercase tracking-[.18em] text-primary">Lost link</p><h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">This page wandered off.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">The route you requested is not part of the recovery desk.</p><Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground" data-testid="link-not-found-home">Return home <ArrowRight size={16} /></Link></div></div>;
}