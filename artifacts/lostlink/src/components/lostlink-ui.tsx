import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Archive,
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpenCheck,
  ClipboardList,
  Compass,
  FileCheck2,
  Flag,
  HeartHandshake,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  PackageCheck,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from 'lucide-react';

type StatusTone = 'teal' | 'amber' | 'slate' | 'red' | 'blue';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/report-lost', label: 'Report lost', icon: Flag },
  { href: '/report-found', label: 'Report found', icon: PackageCheck },
  { href: '/matches', label: 'Potential matches', icon: Compass },
  { href: '/claims', label: 'Claims', icon: ClipboardList },
  { href: '/admin', label: 'Moderation', icon: SlidersHorizontal },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" data-testid="link-logo">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${light ? 'bg-teal-400/20 text-teal-300' : 'bg-primary text-primary-foreground'}`}>
        <HeartHandshake size={19} strokeWidth={2.3} />
      </span>
      <span className={`font-display text-[17px] font-extrabold tracking-tight ${light ? 'text-white' : 'text-foreground'}`}>LostLink</span>
    </Link>
  );
}

export function StatusPill({ label, tone = 'slate' }: { label: string; tone?: StatusTone }) {
  const colors: Record<StatusTone, string> = {
    teal: 'bg-primary/10 text-primary',
    amber: 'bg-accent/20 text-amber-800',
    slate: 'bg-secondary text-muted-foreground',
    red: 'bg-destructive/10 text-destructive',
    blue: 'bg-sky-100 text-sky-800',
  };
  return <span className={`status-pill ${colors[tone]}`} data-testid={`status-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</span>;
}

export function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="animate-rise">
        {eyebrow && <p className="mb-2 font-mono-app text-[10px] font-semibold uppercase tracking-[.19em] text-primary">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-extrabold tracking-[-.035em] text-foreground sm:text-[38px]" data-testid="text-page-title">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground" data-testid="text-page-description">{description}</p>}
      </div>
      {action && <div className="animate-rise animate-rise-1 shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Archive,
  title,
  description,
  action,
}: {
  icon?: typeof Archive;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid-paper flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 text-center" data-testid="empty-state">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary"><Icon size={22} /></span>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ onRetry, label = 'We could not load this space.' }: { onRetry: () => void; label?: string }) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6" data-testid="error-state">
      <div className="flex items-start gap-3">
        <LifeBuoy className="mt-0.5 text-destructive" size={20} />
        <div>
          <p className="font-semibold text-foreground">{label}</p>
          <p className="mt-1 text-sm text-muted-foreground">The service may be taking a moment. Try again when you are ready.</p>
          <button onClick={onRetry} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" data-testid="button-retry">Try again <ArrowRight size={15} /></button>
        </div>
      </div>
    </div>
  );
}

export function SkeletonRows({ count = 3 }: { count?: number }) {
  return <div className="space-y-3" data-testid="loading-skeleton">{Array.from({ length: count }).map((_, index) => <div key={index} className="skeleton h-[76px] w-full" />)}</div>;
}

export function PrimaryButton({ children, onClick, type = 'button', disabled = false, className = '', testId = 'button-primary' }: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; className?: string; testId?: string }) {
  return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:shadow-lift disabled:pointer-events-none disabled:opacity-50 ${className}`} data-testid={testId}>{children}</button>;
}

export function SecondaryButton({ children, onClick, type = 'button', disabled = false, className = '', testId = 'button-secondary' }: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; className?: string; testId?: string }) {
  return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary disabled:pointer-events-none disabled:opacity-50 ${className}`} data-testid={testId}>{children}</button>;
}

export function InputField({ label, value, onChange, placeholder, required = false, type = 'text', multiline = false, hint, testId }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; type?: string; multiline?: boolean; hint?: string; testId: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-xs font-bold text-foreground">{label}{required && <span className="text-primary">*</span>}</span>
      {multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} rows={4} className="w-full resize-y rounded-xl border border-input bg-background px-3.5 py-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10" data-testid={testId} /> : <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} type={type} className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10" data-testid={testId} />}
      {hint && <span className="mt-1.5 block text-[11px] leading-4 text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const active = (href: string) => location === href;

  return (
    <div className="min-h-[100dvh] bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col bg-sidebar px-4 py-5 lg:flex">
        <div className="px-3"><Logo light /></div>
        <div className="mt-12 px-3 font-mono-app text-[9px] font-semibold uppercase tracking-[.2em] text-sidebar-foreground/45">Your recovery desk</div>
        <nav className="mt-3 space-y-1" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${active(href) ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={17} /><span>{label}</span>{label === 'Potential matches' && <span className="ml-auto rounded-full bg-sidebar-primary/15 px-1.5 py-0.5 font-mono-app text-[9px] text-sidebar-primary">new</span>}</Link>)}
        </nav>
        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-sidebar-border bg-sidebar-accent/45 p-4">
            <ShieldCheck size={18} className="text-sidebar-primary" />
            <p className="mt-3 text-sm font-bold text-sidebar-accent-foreground">Ownership comes first.</p>
            <p className="mt-1 text-xs leading-5 text-sidebar-foreground/58">Private clues stay private until a claim is ready to verify.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border-t border-sidebar-border px-3 pt-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary/20 font-display text-xs font-extrabold text-sidebar-primary">AM</span>
            <div className="min-w-0"><p className="truncate text-sm font-bold text-sidebar-accent-foreground">Avery Morgan</p><p className="text-[11px] text-sidebar-foreground/50">Campus community</p></div>
            <div className="relative ml-auto">
              <button onClick={() => setNoticeOpen(!noticeOpen)} className="rounded-lg p-1.5 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-white" data-testid="button-notifications"><Bell size={16} /></button>
              {noticeOpen && <div className="absolute bottom-10 right-0 w-56 rounded-xl border border-sidebar-border bg-sidebar-accent p-3 shadow-lift" data-testid="panel-notifications"><p className="text-xs font-bold text-sidebar-accent-foreground">You are all caught up.</p><p className="mt-1 text-[11px] leading-5 text-sidebar-foreground/60">New match and claim updates will appear here.</p></div>}
            </div>
          </div>
        </div>
      </aside>
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur-md sm:px-8 lg:hidden">
          <div className="flex items-center justify-between"><Logo /><button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-xl border border-border bg-card p-2.5" data-testid="button-mobile-menu">{mobileOpen ? <X size={19} /> : <Menu size={19} />}</button></div>
          {mobileOpen && <nav className="mt-3 space-y-1 border-t border-border pt-3">{navItems.map(({ href, label, icon: Icon }) => <Link onClick={() => setMobileOpen(false)} key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${active(href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`} data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={17} />{label}</Link>)}</nav>}
        </header>
        <main className="mx-auto max-w-[1360px] px-4 py-7 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}

export function MetricCard({ label, value, detail, icon: Icon, accent = 'teal' }: { label: string; value: string | number; detail: string; icon: typeof LayoutDashboard; accent?: 'teal' | 'amber' | 'blue' | 'slate' }) {
  const accentClass = { teal: 'bg-primary/10 text-primary', amber: 'bg-accent/20 text-amber-800', blue: 'bg-sky-100 text-sky-800', slate: 'bg-secondary text-muted-foreground' }[accent];
  return <div className="rounded-2xl border border-card-border bg-card p-5 shadow-soft transition-transform hover:-translate-y-1" data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="flex items-start justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClass}`}><Icon size={19} /></span><span className="font-mono-app text-[10px] text-muted-foreground">THIS TERM</span></div><p className="mt-5 font-display text-3xl font-extrabold tracking-tight">{value}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p><p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">{detail}</p></div>;
}

export function TrustStrip() {
  return <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-border py-4 text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-primary" /> Private clues stay hidden</span><span className="flex items-center gap-2"><BadgeCheck size={15} className="text-primary" /> Human-first verification</span><span className="flex items-center gap-2"><BookOpenCheck size={15} className="text-primary" /> Campus service standard</span></div>;
}

export function ItemThumbnail({ imageUrl, type }: { imageUrl?: string; type: string }) {
  if (imageUrl) return <img src={imageUrl} alt="" className="h-14 w-14 rounded-xl object-cover" data-testid="img-item-thumbnail" />;
  return <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${type === 'lost' ? 'bg-amber-100 text-amber-800' : 'bg-primary/10 text-primary'}`}><Search size={20} /></div>;
}

export function DetailLabel({ label, value }: { label: string; value?: string }) {
  return <div><p className="font-mono-app text-[9px] font-semibold uppercase tracking-[.16em] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold text-foreground">{value || 'Not provided'}</p></div>;
}

export function SectionRule({ children }: { children: ReactNode }) {
  return <div className="mb-4 flex items-center gap-3"><h2 className="font-display text-[15px] font-extrabold">{children}</h2><span className="h-px flex-1 bg-border" /></div>;
}