import type { ReactNode } from 'react';

export function Page({
  kicker,
  title,
  lead,
  children,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">
        <header className="space-y-3">
          {kicker && <div className="text-[11px] uppercase tracking-[0.22em] text-accent">{kicker}</div>}
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {lead && <p className="text-slate-400 text-[15px] leading-relaxed max-w-3xl">{lead}</p>}
        </header>
        {children}
      </div>
    </div>
  );
}

export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-panel p-5 space-y-3">
      {title && <h2 className="text-base font-medium text-cyan-100">{title}</h2>}
      {children}
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-sm text-slate-300 leading-relaxed">{children}</p>;
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="text-sm text-slate-300 space-y-1.5 list-disc pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
