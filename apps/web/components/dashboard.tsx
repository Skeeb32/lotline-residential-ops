"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Building2, CalendarDays,
  Check, ChevronDown, CircleDollarSign, ClipboardList, Command, FileText,
  LayoutDashboard, Menu, Plus, Search, Settings2, SlidersHorizontal, Sparkles,
  UsersRound, X,
} from "lucide-react";
import { assets as demoAssets, initialTasks, type Asset, type Task } from "@/lib/data";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Acquisitions", icon: Building2, count: "3" },
  { label: "Investors", icon: UsersRound },
  { label: "Operations", icon: ClipboardList, count: "8" },
  { label: "Reporting", icon: FileText },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 1, notation: "compact" }).format(value);
}

export function Dashboard() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [assets, setAssets] = useState<Asset[]>(demoAssets);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All assets");
  const [showCreate, setShowCreate] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;
    fetch(`${apiUrl}/assets`, { signal: AbortSignal.timeout(2500) })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("API unavailable")))
      .then((rows: Array<Record<string, unknown>>) => {
        if (rows.length === 0) return;
        setAssets(rows.map((row, index) => ({
          id: String(row._id ?? row.id ?? `AST-${index + 1}`),
          name: String(row.name),
          location: String(row.location),
          units: Number(row.units),
          funded: Number(row.fundedPercent),
          target: 100,
          occupancy: Number(row.occupancyPercent),
          status: row.status as Asset["status"],
          initials: String(row.name).split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
          tone: ["sage", "sand", "blue", "rose"][index % 4],
        })));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!showCreate) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowCreate(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showCreate]);

  const visibleAssets = useMemo(() => assets.filter((asset) => {
    const matchesText = `${asset.name} ${asset.location} ${asset.id}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = filter === "All assets" || asset.status === filter;
    return matchesText && matchesStatus;
  }), [assets, filter, query]);

  function completeTask(id: string) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: true } : task));
  }

  async function createAsset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const location = String(form.get("location") ?? "").trim();
    const units = Number(form.get("units"));
    const nextAsset: Asset = {
      id: `AST-${Math.floor(2070 + Math.random() * 900)}`, name, location, units,
      funded: 0, target: 100, occupancy: 0, status: "Review",
      initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(), tone: "sage",
    };
    setAssets((current) => [nextAsset, ...current]);
    setShowCreate(false);
    setToast(`${name} added to your portfolio`);
    window.setTimeout(() => setToast(""), 3200);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      void fetch(`${apiUrl}/assets`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, units, fundedPercent: 0, occupancyPercent: 0, status: "Review" }),
      }).catch(() => undefined);
    }
  }

  const openTasks = tasks.filter((task) => !task.done).length;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${showMobileNav ? "sidebar-open" : ""}`}>
        <div className="brand-lockup"><div className="brand-mark"><span /><span /><span /></div><span>lotline</span><button className="mobile-close icon-button" aria-label="Close navigation" onClick={() => setShowMobileNav(false)}><X size={18} /></button></div>
        <div className="workspace-switch"><div className="workspace-avatar">N</div><div className="workspace-copy"><span>Workspace</span><strong>Northstar Capital</strong></div><ChevronDown size={15} /></div>
        <div className="nav-caption">WORKSPACE</div>
        <nav aria-label="Main navigation" className="main-nav">
          {navItems.map(({ label, icon: Icon, count }) => <button key={label} className={`nav-link ${activeNav === label ? "active" : ""}`} onClick={() => { setActiveNav(label); setShowMobileNav(false); }}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{count && <span className="nav-count">{count}</span>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><Sparkles size={16} /></div><strong>More signal, less busywork.</strong><p>Keep every property moving with one clear operating picture.</p><button onClick={() => setToast("Your Lotline workspace is ready to explore.")}>Explore workspace <ArrowRight size={14} /></button></div>
          <button className="nav-link muted-link"><Settings2 size={18} /><span>Settings</span></button>
          <div className="profile-row"><div className="profile-avatar">SH</div><div className="profile-copy"><strong>Shaqib Habib</strong><span>Administrator</span></div><button className="icon-button" aria-label="Profile options"><ChevronDown size={16} /></button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setShowMobileNav(true)}><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{activeNav}</strong></div>
          <div className="top-actions"><button className="search-trigger" onClick={() => document.getElementById("asset-search")?.focus()}><Search size={16} /><span>Search anything...</span><kbd><Command size={11} /> K</kbd></button><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="top-avatar">SH</div></div>
        </header>

        <div className="page-content">
          <div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> TUESDAY, OCTOBER 14, 2026</div><h1>Your portfolio, <em>in motion.</em></h1><p className="page-subtitle">A clear view of the work behind every property.</p></div><button className="primary-button" onClick={() => setShowCreate(true)}><Plus size={17} /> Add property</button></div>

          <section className="metrics-grid" aria-label="Portfolio summary">
            <MetricCard label="Portfolio value" value="$18.4M" change="8.2%" trend="up" icon={<Building2 size={17} />} note="vs. last quarter" />
            <MetricCard label="Capital funded" value="$12.7M" change="3.6%" trend="up" icon={<CircleDollarSign size={17} />} note="of $15.2M target" progress={84} />
            <MetricCard label="Occupied units" value="92.6%" change="1.4%" trend="up" icon={<UsersRound size={17} />} note="across 4 properties" />
            <MetricCard label="Open work" value={String(openTasks).padStart(2, "0")} change="2 due today" trend="down" icon={<ClipboardList size={17} />} note="across your team" />
          </section>

          <div className="content-grid">
            <section className="panel assets-panel">
              <div className="panel-header"><div><div className="section-kicker">THE PORTFOLIO</div><h2>Properties <span className="count-pill">{assets.length}</span></h2></div><button className="text-button" onClick={() => setActiveNav("Acquisitions")}>View portfolio <ArrowRight size={15} /></button></div>
              <div className="table-toolbar"><label className="table-search"><Search size={15} /><input id="asset-search" type="search" placeholder="Find a property" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label className="filter-select"><SlidersHorizontal size={14} /><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter properties"><option>All assets</option><option>Operating</option><option>Launching</option><option>Review</option></select><ChevronDown size={13} /></label></div>
              <div className="table-wrap"><table><thead><tr><th>PROPERTY</th><th>STATUS</th><th>FUNDING</th><th>OCCUPANCY</th><th aria-label="Details" /></tr></thead><tbody>{visibleAssets.map((asset) => <tr key={asset.id} className="asset-row"><td><div className="property-cell"><div className={`property-monogram ${asset.tone}`}>{asset.initials}</div><div><strong>{asset.name}</strong><span>{asset.location} <i /> {asset.units} units</span></div></div></td><td><span className={`status-badge ${asset.status.toLowerCase()}`}><i />{asset.status}</span></td><td><div className="funding-cell"><div className="funding-line"><span>{asset.funded}%</span><small>of target</small></div><div className="progress-track"><span style={{ width: `${asset.funded}%` }} /></div></div></td><td><div className="occupancy-cell"><strong>{asset.occupancy ? `${asset.occupancy}%` : "—"}</strong><span>{asset.occupancy ? "leased" : "Pre-launch"}</span></div></td><td><button className="row-action" aria-label={`View ${asset.name}`} onClick={() => setToast(`${asset.name} · ${asset.id}`)}><ArrowRight size={16} /></button></td></tr>)}</tbody></table>{visibleAssets.length === 0 && <div className="empty-state">No properties match that search.</div>}</div>
              <div className="panel-footer"><span>Showing <strong>{visibleAssets.length}</strong> of {assets.length} properties</span><button onClick={() => { setQuery(""); setFilter("All assets"); }}>Reset view</button></div>
            </section>

            <section className="panel tasks-panel">
              <div className="panel-header"><div><div className="section-kicker">KEEP THINGS MOVING</div><h2>Priority queue <span className="count-pill warm">{openTasks}</span></h2></div><button className="icon-button panel-menu" aria-label="Task options"><span className="ellipsis">•••</span></button></div>
              <div className="task-list">{tasks.map((task) => <div key={task.id} className={`task-item ${task.done ? "task-done" : ""}`}><button className="task-check" aria-label={task.done ? `${task.title} complete` : `Complete ${task.title}`} onClick={() => completeTask(task.id)}>{task.done && <Check size={13} />}</button><div className="task-copy"><div className="task-title-line"><strong>{task.title}</strong>{task.priority === "High" && !task.done && <span className="priority-dot" aria-label="High priority" />}</div><span>{task.detail}</span><div className="task-meta"><span><CalendarDays size={12} />{task.due}</span><span className="owner-avatar">{task.owner}</span></div></div></div>)}</div>
              <button className="queue-link" onClick={() => setActiveNav("Operations")}>Open operations <ArrowRight size={15} /></button>
            </section>
          </div>

          <section className="lower-grid">
            <div className="panel activity-panel"><div className="panel-header"><div><div className="section-kicker">CAPITAL MOVEMENT</div><h2>Funding pace</h2></div><button className="period-select">Last 6 months <ChevronDown size={14} /></button></div><div className="chart-wrap"><div className="chart-y-axis"><span>$15M</span><span>$10M</span><span>$5M</span><span>$0</span></div><div className="chart-area"><div className="chart-gridline one" /><div className="chart-gridline two" /><div className="chart-gridline three" /><div className="chart-gridline four" /><svg viewBox="0 0 640 180" preserveAspectRatio="none" role="img" aria-label="Capital funded grew from 6.2 million to 12.7 million over six months"><defs><linearGradient id="funding-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#7a9b77" stopOpacity=".25" /><stop offset="100%" stopColor="#7a9b77" stopOpacity="0" /></linearGradient></defs><path d="M0 142 C42 135 48 128 82 132 S132 115 160 118 S212 103 240 111 S292 84 320 91 S375 77 400 83 S452 58 480 67 S530 51 560 58 S612 36 640 30 L640 180 L0 180Z" fill="url(#funding-fill)" /><path d="M0 142 C42 135 48 128 82 132 S132 115 160 118 S212 103 240 111 S292 84 320 91 S375 77 400 83 S452 58 480 67 S530 51 560 58 S612 36 640 30" fill="none" stroke="#638462" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" /></svg><div className="chart-x-axis"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div></div></div><div className="chart-legend"><span><i className="legend-funded" /> Capital funded</span><span><i className="legend-target" /> Target pace</span><strong><ArrowUpRight size={14} /> 18.4% <small>above plan</small></strong></div></div>
            <div className="distribution-card"><div className="distribution-top"><div className="section-kicker">NEXT DISTRIBUTION</div><div className="distribution-icon"><CircleDollarSign size={19} /></div></div><div className="distribution-amount">$248,600</div><div className="distribution-caption">Quarterly investor distribution</div><div className="distribution-divider" /><div className="distribution-row"><span>Property</span><strong>The Linden</strong></div><div className="distribution-row"><span>Investor accounts</span><strong>38 accounts</strong></div><div className="distribution-row"><span>Scheduled for</span><strong>Oct 24, 2026</strong></div><button className="distribution-button" onClick={() => setToast("Distribution batch is ready for review.")}>Review distribution <ArrowRight size={15} /></button><div className="distribution-footnote"><span className="secure-dot" /> Demo data · review before execution</div></div>
          </section>
          <footer className="page-footer"><span>© 2026 Lotline Systems</span><span>Portfolio operations <i /> Demo workspace</span></footer>
        </div>
      </main>

      {showCreate && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCreate(false); }}><section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><div className="section-kicker">PORTFOLIO INTAKE</div><h2 id="modal-title">Add a property</h2></div><button className="icon-button" aria-label="Close dialog" onClick={() => setShowCreate(false)}><X size={18} /></button></div><p className="modal-intro">Start a property record. You can add underwriting and investor details later.</p><form onSubmit={createAsset}><label>Property name<input name="name" required minLength={2} placeholder="e.g. Cedar Row" autoFocus /></label><label>Location<input name="location" required minLength={2} placeholder="City, State" /></label><label>Unit count<input name="units" required type="number" min="1" defaultValue="12" /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowCreate(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={16} /> Create property</button></div></form></section></div>}
      {toast && <div className="toast" role="status"><Check size={16} />{toast}<button aria-label="Dismiss notification" onClick={() => setToast("")}><X size={14} /></button></div>}
    </div>
  );
}

function MetricCard({ label, value, change, trend, icon, note, progress }: { label: string; value: string; change: string; trend: "up" | "down"; icon: React.ReactNode; note: string; progress?: number }) {
  return <article className="metric-card"><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><div className="metric-value">{value}</div><div className="metric-bottom"><span className={`metric-change ${trend}`} >{trend === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{change}</span><span className="metric-note">{note}</span></div>{progress !== undefined && <div className="metric-progress"><span style={{ width: `${progress}%` }} /></div>}</article>;
}
