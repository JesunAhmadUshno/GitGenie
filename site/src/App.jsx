import { useMemo, useState, useEffect, useId } from 'react';
import constantsSrc from '../../lib/utils/constants.ts?raw';
import serverSrc from '../../server/index.ts?raw';
import prismaSrc from '../../prisma/schema.prisma?raw';
import history from './data/history.json';
import snapshot from '../data/github-snapshot.json';
import { parseAchievements, evaluate, buildEvents, replay, target, repoStats, closeSeconds } from './rules.js';

const stats = repoStats({
  lib: import.meta.glob('../../lib/*/*.ts', { query: '?raw', import: 'default', eager: true }),
  pages: import.meta.glob(['../../app/page.tsx', '../../app/*/*/page.tsx'], { query: '?raw', import: 'default', eager: true }),
  appFiles: import.meta.glob('../../app/**/*.tsx', { query: '?raw', import: 'default', eager: true }),
  server: serverSrc, prisma: prismaSrc,
  k8s: import.meta.glob('../../k8s/*.yaml', { query: '?raw', import: 'default', eager: true }),
  docs: import.meta.glob('../../*.md', { query: '?raw', import: 'default', eager: true }),
});

const REPO = 'https://github.com/JesunAhmadUshno/GitGenie';
const blob = (p, ref = 'main') => `${REPO}/blob/${ref}/${p}`;
const SPEC = parseAchievements(constantsSrc);
const BY_KEY = Object.fromEntries(SPEC.map((a) => [a.key, a]));
const EVENTS = buildEvents(history, snapshot);
const FINAL = replay(EVENTS, EVENTS.length - 1, snapshot).out;
const day = (s) => new Date(s).toISOString().slice(0, 10);
const stamp = (s) => new Date(s).toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
const CAPTURED = day(snapshot.captured_at);
const fmt = (n) => n.toLocaleString('en-US');
const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
const word = (n, lower) => { const w = WORDS[n] ?? String(n); return lower ? w.toLowerCase() : w; };
const TARGETED = new Set(EVENTS.map(target).filter(Boolean)).size;

// Defaults come from the recorded snapshot and git log, so the playground opens on this repo.
const ISSUE3 = snapshot.issues[0];
const RECORDED = {
  mergedPRs: snapshot.pulls.filter((p) => p.merged_at).length,
  unreviewedMerged: snapshot.pulls.filter((p) => p.merged_at && p.review_count === 0).length,
  closedIssues: snapshot.issues.filter((i) => i.closed_at).length,
  fastestCloseSec: Math.min(...snapshot.issues.map(closeSeconds)),
  topRepoStars: snapshot.repo.stargazers_count,
  otherStars: 0,
  coAuthored: history.commits.filter((c) => c.coauthors.length).length,
  acceptedAnswers: 0,
  followers: 0,
  sponsoring: false,
};

const SECTIONS = [['top', 'Overview', '◎'], ['badges', 'Badges', '★'], ['playground', 'Playground', '⚙'], ['history', 'History', '◷'], ['audit', 'Engine audit', '⚠'], ['architecture', 'Architecture', '▤'], ['limits', 'Limits', '!'], ['reproduce', 'Reproduce', '❯_']];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.08 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

function MenuBar() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  return (
    <div className="menubar" role="banner">
      <span className="apple" aria-hidden="true">◆</span>
      <a className="app" href="#top">GitGenie</a>
      <a className="m" href={blob('lib/utils/constants.ts')}>constants.ts</a>
      <a className="m" href={blob('lib/services/achievements.ts')}>achievements.ts</a>
      <a className="m" href={blob('docs/research-review.md')}>Engineering review</a>
      <span className="spacer" />
      <span className="status"><i /> Rules checked at build</span>
      <a href={REPO}>GitHub ↗</a>
      <span className="clock">{now.toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</span>
    </div>
  );
}

function Dock() {
  const [active, setActive] = useState('top');
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <nav className="dock" aria-label="Sections">
      {SECTIONS.map(([id, label, icon]) => (
        <a key={id} href={`#${id}`} className={active === id ? 'on' : ''} aria-current={active === id ? 'true' : undefined}>
          <span className="ico" aria-hidden="true">{icon}</span><span className="lbl">{label}</span>
        </a>
      ))}
    </nav>
  );
}

function Range({ label, value, min, max, step = 1, onChange, show }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label} <span>{show ?? value}</span></label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </div>
  );
}

const Verdict = ({ v, label }) => v === null
  ? <span className="pill warn">no rule</span>
  : <span className={`pill ${v ? 'good' : 'bad'}`}>{v ? '✓ unlocked' : '✕ locked'}{label ? ` ${label}` : ''}</span>;

export default function App() {
  useReveal();
  const [mode, setMode] = useState('written');
  return (
    <div className="wrap">
      <MenuBar />
      <div className="glow" aria-hidden="true" />
      <Hero />
      <Badges />
      <Playground mode={mode} setMode={setMode} />
      <History />
      <Audit setMode={setMode} />
      <Architecture />
      <Limits />
      <Reproduce />
      <Dock />
      <footer>
        Code: MIT. Badge rules are GitGenie's own (<code>lib/utils/constants.ts</code>), not GitHub's published policy. Every number on this page is read from the repo at build time or computed in your browser; PR and issue metadata is a recorded <code>gh api</code> snapshot from {CAPTURED}.
      </footer>
    </div>
  );
}

function Hero() {
  const mismatches = evaluate(SPEC, RECORDED, 'written').filter((r) => r.mismatch).length;
  return (
    <header className="card hero window" id="top" data-title="GitGenie — README">
      <div className="head">
        <p className="eyebrow">Product app · Phase 0/1 · landing page plus stubs</p>
        <span className="pill warn">● Early build</span>
      </div>
      <h1>GitGenie turns GitHub's hidden badges into <em>checkable rules</em>, then replays its own history against them.</h1>
      <p className="sub">
        GitGenie is a Next.js app that wants to tell you which GitHub achievements you have earned and how to earn the rest.
        Today it is a landing page, {stats.stubPages} "coming soon" routes and a client-side detector engine that no page calls yet.
        This dashboard runs that engine in your browser, as originally written and as fixed on this branch, so you can see where it disagrees with its own rulebook.
      </p>
      <div className="actions">
        <a className="btn primary" href="#playground">Open the rule playground</a>
        <a className="btn ghost" href="#history">Replay the repo's badge trials</a>
        <span className="hint">Stack: Next.js static export, TypeScript, Tailwind, Prisma schema, Express stub</span>
      </div>
      <div className="tiles">
        <div className="tile"><div className="num">{SPEC.length}</div><div className="cap">Achievement rules parsed from <code>constants.ts</code></div></div>
        <div className="tile"><div className="num">{mismatches}</div><div className="cap">Badges where the original engine disagrees with its spec on this repo's data</div></div>
        <div className="tile"><div className="num">{fmt(stats.libLines)}</div><div className="cap">Lines of code in <code>lib/</code> ({stats.libFiles} files)</div></div>
        <div className="tile"><div className="num">{fmt(stats.docLines)}</div><div className="cap">Lines of planning docs in {stats.docFiles} root markdown files</div></div>
      </div>
    </header>
  );
}

const ENGINE_NOTE = {
  QUICK_DRAW: 'Original counts closed issues; fixed compares closed_at − created_at with the limit.',
  PULL_SHARK: 'Original reads pr.merged_at; fixed reads pull_request.merged_at from search items.',
  YOLO: 'Original reads review_comments; fixed needs a known review count of zero.',
  PAIR_EXTRAORDINAIRE: 'Original always returns locked; fixed reads co-author trailers.',
  GALAXY_BRAIN: 'Both count issues opened. Discussion answers are never fetched.',
  STARSTRUCK: 'Original sums stars over all repos; fixed takes the best single repo.',
  PUBLIC_SPONSOR: 'Both always return locked: sponsor status is not fetched.',
  HEART_ON_YOUR_SLEEVE: 'Both count followers, a third reading of an unclear rule.',
};

function Badges() {
  return (
    <section id="badges" className="card window reveal" data-title={`achievements.ts — ${SPEC.length} rules`}>
      <p className="eyebrow">Badge catalogue</p>
      <h2>{word(SPEC.length)} rules, generated from the repo's constants file at build time.</h2>
      <p className="sub">
        Names, icons, colours and thresholds below are parsed from <a href={blob('lib/utils/constants.ts')}>lib/utils/constants.ts</a> on every build, so this list cannot drift from the code.
        These are GitGenie's own definitions. The repo cites no GitHub source for them, so treat them as the project's claims, not GitHub policy.
      </p>
      <div className="badge-grid" style={{ marginTop: 16 }}>
        {SPEC.map((a) => (
          <article className="tile badge" key={a.key} style={{ '--badge': a.color }}>
            <div className="badge-top"><span className="badge-ico" aria-hidden="true">{a.icon}</span><div><h3>{a.name}</h3><p className="hint" style={{ margin: 0 }}>{a.description}</p></div></div>
            <div className="chips">
              {Object.entries(a.requirements).map(([k, v]) => <span className="chip mono" key={k}>{k}={String(v)}</span>)}
            </div>
            <p className="hint engine-note">{ENGINE_NOTE[a.key]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Playground({ mode, setMode }) {
  const [c, setC] = useState(RECORDED);
  const set = (k) => (v) => setC((s) => {
    const n = { ...s, [k]: v };
    if (n.unreviewedMerged > n.mergedPRs) n.unreviewedMerged = n.mergedPRs;
    return n;
  });
  const rows = useMemo(() => evaluate(SPEC, c, mode), [c, mode]);
  const mism = rows.filter((r) => r.mismatch).length;
  const isRecorded = JSON.stringify(c) === JSON.stringify(RECORDED);
  return (
    <section id="playground" className="card window reveal" data-title="badge_checker — live">
      <div className="head">
        <div>
          <p className="eyebrow">Rule playground · computed in your browser</p>
          <h2>Move the sliders and watch the engine argue with its own spec.</h2>
          <p className="sub">
            Your inputs become the same JSON shapes GitHub's search API returns, then run through GitGenie's detectors. "As fixed" imports
            the real functions from <code>lib/services/achievements.ts</code>; "as written" is a port of them at commit <code>{history.original}</code>.
            The spec column applies the <code>constants.ts</code> thresholds directly. It opens on this repo's recorded numbers.
          </p>
        </div>
        <span className={`pill ${mism ? 'bad' : 'good'}`}>{mism} of {rows.length} disagree</span>
      </div>
      <div className="seg" role="group" aria-label="Engine version">
        {[['written', `As written (${history.original})`], ['fixed', 'As fixed (this branch)']].map(([k, l]) => (
          <button key={k} aria-pressed={mode === k} onClick={() => setMode(k)}>{l}</button>
        ))}
      </div>
      <div className="controls" style={{ marginTop: 16 }}>
        <Range label="Merged pull requests" value={c.mergedPRs} min={0} max={10} onChange={set('mergedPRs')} />
        <Range label="…merged with zero reviews" value={c.unreviewedMerged} min={0} max={c.mergedPRs} onChange={set('unreviewedMerged')} />
        <Range label="Closed issues" value={c.closedIssues} min={0} max={10} onChange={set('closedIssues')} />
        <Range label="Fastest open-to-close" value={c.fastestCloseSec} min={1} max={900} onChange={set('fastestCloseSec')} show={c.fastestCloseSec < 60 ? `${c.fastestCloseSec} s` : `${(c.fastestCloseSec / 60).toFixed(1)} min`} />
        <Range label="Stars on your best repo" value={c.topRepoStars} min={0} max={40} onChange={set('topRepoStars')} />
        <Range label="Stars on all other repos" value={c.otherStars} min={0} max={40} onChange={set('otherStars')} />
        <Range label="Commits with a co-author" value={c.coAuthored} min={0} max={5} onChange={set('coAuthored')} />
        <Range label="Accepted discussion answers" value={c.acceptedAnswers} min={0} max={5} onChange={set('acceptedAnswers')} />
        <Range label="Followers" value={c.followers} min={0} max={40} onChange={set('followers')} />
        <div className="field check"><label htmlFor="sponsor"><input id="sponsor" type="checkbox" checked={c.sponsoring} onChange={(e) => set('sponsoring')(e.target.checked)} /> Active public sponsorship</label></div>
      </div>
      <div className="actions" style={{ marginTop: 0, marginBottom: 16 }}>
        <button className="btn ghost" onClick={() => setC(RECORDED)} disabled={isRecorded}>Load this repo's recorded numbers</button>
        <span className="hint">{isRecorded ? `Showing the recorded inputs (snapshot ${CAPTURED}; followers and answers were not recorded, so they start at 0).` : 'Custom inputs.'}</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead><tr><th>Badge</th><th>constants.ts says</th><th>Engine says</th><th>Check</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className={r.mismatch ? 'mis' : ''}>
                <td><span aria-hidden="true">{r.icon}</span> {r.name}</td>
                <td><Verdict v={r.spec} /></td>
                <td><Verdict v={r.engine} /></td>
                <td>{r.mismatch ? <span className="pill bad">⚑ mismatch</span> : <span className="pill good">agrees</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const KIND = { commit: ['Commit', 'var(--muted)'], merge: ['Merge commit', 'var(--muted)'], pair: ['Commit with a co-author', 'var(--primary)'], pr: ['Pull request merged', 'var(--good)'], issue: ['Issue closed', 'var(--warn)'] };

function History() {
  const firstTarget = EVENTS.findIndex((e) => target(e));
  const [sel, setSel] = useState(EVENTS.findIndex((e) => e.issue));
  const e = EVENTS[sel];
  const t = target(e);
  const state = useMemo(() => replay(EVENTS, sel, snapshot).out, [sel]);
  const W = 960, H = 170, padX = 28;
  const x = (i) => padX + (i / (EVENTS.length - 1)) * (W - 2 * padX);
  const laneY = (ev) => (ev.pr || ev.issue ? 112 : 56);
  const days = [];
  EVENTS.forEach((ev, i) => { const d = day(ev.at); if (!days.length || days[days.length - 1].d !== d) days.push({ d, i }); });
  const move = (k) => setSel((s) => Math.max(0, Math.min(EVENTS.length - 1, s + k)));
  return (
    <section id="history" className="card window reveal" data-title="git log — badge trials">
      <div className="head">
        <div>
          <p className="eyebrow">Own-history audit · recorded replay</p>
          <h2>The repo tried for {word(TARGETED, true)} badges. Click an event to judge it.</h2>
          <p className="sub">
            Commits come from <code>git log</code> at build time; PR merge times, review counts and issue #{ISSUE3.number}'s timestamps come from a <code>gh api</code> snapshot
            recorded on {CAPTURED} (<a href={blob('site/data/github-snapshot.json')}>github-snapshot.json</a>). Selecting an event replays everything up to it through both engines in your browser.
            A verdict here is GitGenie's rule, not proof that GitHub awarded the badge.
          </p>
        </div>
        <span className="pill warn">RECORDED {CAPTURED}</span>
      </div>
      <div className="wide" style={{ overflowX: 'auto' }}>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Timeline of ${EVENTS.length} recorded repo events`}>
        <text x={4} y={44}>git log</text><text x={4} y={100}>GitHub</text>
        {[56, 112].map((y) => <line key={y} className="axis" x1={padX} x2={W - padX} y1={y} y2={y} />)}
        {days.map(({ d, i }) => <g key={d}><line className="axis" x1={x(i) - 10} x2={x(i) - 10} y1={20} y2={140} strokeDasharray="3 4" /><text x={x(i) - 6} y={156}>{d}</text></g>)}
        {EVENTS.map((ev, i) => {
          const tg = target(ev), on = i === sel;
          return (
            <g key={i} className="ev" tabIndex={0} role="button" aria-label={`${KIND[ev.kind][0]} ${ev.label}: ${ev.title}`} aria-pressed={on}
              onClick={() => setSel(i)} onKeyDown={(k) => { if (k.key === 'Enter' || k.key === ' ') { k.preventDefault(); setSel(i); } }}>
              <circle cx={x(i)} cy={laneY(ev)} r={on ? 10 : tg ? 7.5 : 4.5} fill={KIND[ev.kind][1]} stroke={on ? 'var(--text)' : 'var(--surface-strong)'} strokeWidth={on ? 2.5 : 1.5} />
              {tg && <text x={x(i)} y={laneY(ev) - 15} textAnchor="middle" style={{ fill: 'var(--text)' }}>{BY_KEY[tg].icon}</text>}
            </g>
          );
        })}
      </svg>
      </div>
      <div className="legend">{Object.entries(KIND).map(([k, [l, col]]) => <span key={k}><i style={{ background: col }} />{l}</span>)}<span>Larger dot: targets a badge</span></div>
      <div className="actions" style={{ marginTop: 12 }}>
        <button className="btn ghost" onClick={() => move(-1)} disabled={sel === 0}>← Previous event</button>
        <button className="btn ghost" onClick={() => move(1)} disabled={sel === EVENTS.length - 1}>Next event →</button>
        <button className="btn ghost" onClick={() => setSel(firstTarget)}>First badge attempt</button>
        <span className="hint mono">event {sel + 1} / {EVENTS.length}</span>
      </div>
      <div className="grid2" style={{ marginTop: 16 }}>
        <div className="tile" aria-live="polite" style={{ alignSelf: 'start' }}>
          <p className="eyebrow" style={{ marginBottom: 4 }}>{KIND[e.kind][0]} · {stamp(e.at)}</p>
          <h3><span className="mono">{e.label}</span> {e.title}</h3>
          {e.commit && <p className="hint">Author {e.commit.author}{e.commit.coauthors.length ? `, co-author @${e.commit.coauthors.join(', @')} (co-author trailer)` : ''}.</p>}
          {e.pr && <p className="hint">Opened {stamp(e.pr.created_at)}, {e.pr.commits} commit(s), {e.pr.review_count} review(s): {e.pr.review_states.join(', ')}.</p>}
          {e.issue && <p className="hint">Opened {stamp(e.issue.created_at)}, closed {closeSeconds(e.issue)} s later.</p>}
          {t ? (
            <div style={{ marginTop: 10 }}>
              <p className="hint" style={{ margin: '0 0 6px' }}>Targets <b>{BY_KEY[t].icon} {BY_KEY[t].name}</b>. Verdict after this event:</p>
              <div className="actions" style={{ marginTop: 0 }}><Verdict v={state[t].written} label="as written" /><Verdict v={state[t].fixed} label="as fixed" /></div>
              {t === 'YOLO' && <p className="hint">Titled "yolo", but it had {e.pr.review_count} reviews, so by GitGenie's own rule it is not an unreviewed merge.</p>}
            </div>
          ) : <p className="hint">This event does not target a badge.</p>}
        </div>
        <div>
          <h3>All eight rules after event {sel + 1}</h3>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead><tr><th>Badge</th><th>As written</th><th>As fixed</th></tr></thead>
              <tbody>{SPEC.map((a) => <tr key={a.key}><td><span aria-hidden="true">{a.icon}</span> {a.name}</td><td>{state[a.key].written ? '✓' : '✕'}</td><td className={state[a.key].fixed ? 'ok' : ''}>{state[a.key].fixed ? '✓' : '✕'}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function Audit({ setMode }) {
  const show = (m) => { setMode(m); document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' }); };
  const ev = snapshot.search_pr_item;
  const evidence = {
    pull_shark: `Recorded search item: top-level merged_at ${ev.has_top_level_merged_at ? 'present' : 'absent'}, pull_request.merged_at ${ev.has_pull_request_merged_at ? 'present' : 'absent'}.`,
    yolo: `Recorded search item: review_comments ${ev.has_review_comments ? 'present' : 'absent'}.`,
    quick_draw: `Issue #${ISSUE3.number} closed after ${closeSeconds(ISSUE3)} s.`,
    startstruck: `This repo: ${snapshot.repo.stargazers_count} stars.`,
  };
  const keyOf = { pull_shark: 'PULL_SHARK', yolo: 'YOLO', quick_draw: 'QUICK_DRAW', startstruck: 'STARSTRUCK' };
  return (
    <section id="audit" className="card window reveal" data-title="github.ts — field check">
      <p className="eyebrow">Engine audit</p>
      <h2>{word(history.defects.length)} lines that made the detector wrong, quoted from the original commit.</h2>
      <p className="sub">
        Each line is read from <code>git show {history.original}:&lt;file&gt;</code> at build time, with its line number. Each card replays this repo's recorded history through both engines.
        All {word(history.defects.length, true)} are fixed on this branch with tests in <a href={blob('tests/achievements.test.ts')}>tests/achievements.test.ts</a>.
        One more structural finding: <code>detectAchievements</code> is imported by {stats.engineImporters} of the app's pages, so the live site never ran any of it.
      </p>
      <div className="defects" style={{ marginTop: 16 }}>
        {history.defects.map((d) => {
          const k = keyOf[d.badge];
          return (
            <article className="tile defect" key={d.file + d.line}>
              <div className="head" style={{ marginBottom: 8 }}>
                <a className="mono" href={`${blob(d.file, history.original)}#L${d.line}`}>{d.file}:{d.line}</a>
                {k ? <span className="actions" style={{ marginTop: 0, gap: 6 }}><Verdict v={FINAL[k].written} label="written" /><Verdict v={FINAL[k].fixed} label="fixed" /></span> : <span className="pill info">rate-limit helper</span>}
              </div>
              <pre className="q">{d.code}</pre>
              <p style={{ margin: '10px 0 0', fontSize: 13 }}>{d.why}</p>
              {evidence[d.badge] && <p className="hint" style={{ margin: '4px 0 0' }}>{evidence[d.badge]}</p>}
              {k && <div className="seg" role="group" aria-label={`Open ${BY_KEY[k].name} in the playground`} style={{ marginTop: 10 }}><button onClick={() => show('written')}>Playground: as written</button><button onClick={() => show('fixed')}>as fixed</button></div>}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Architecture() {
  const boxes = [
    { x: 20, y: 30, w: 270, t: 'Next.js static export', d: `${stats.pages} pages, ${stats.stubPages} are "coming soon"`, built: true },
    { x: 345, y: 30, w: 270, t: 'Detector engine (lib/)', d: `${stats.libFiles} files, imported by ${stats.engineImporters} pages`, built: true },
    { x: 670, y: 30, w: 270, t: 'GitHub REST API', d: 'Public, unauthenticated calls', built: true, ext: true },
    { x: 20, y: 150, w: 270, t: 'Express API (server/)', d: `${stats.liveRoutes} live route, ${stats.commentedRoutes} commented out`, built: false },
    { x: 345, y: 150, w: 270, t: 'Prisma + Postgres', d: `${stats.prismaModels} models in schema, no database`, built: false },
    { x: 670, y: 150, w: 270, t: 'Redis + Kubernetes', d: `${stats.k8sManifests} manifests, never deployed`, built: false },
  ];
  const H = 250;
  return (
    <section id="architecture" className="card window reveal" data-title="PROJECT_ARCHITECTURE.md">
      <p className="eyebrow">Architecture · built versus planned</p>
      <h2>A full-stack plan, with only the front edge built.</h2>
      <p className="sub">
        The architecture doc describes real-time tracking, leaderboards and recommendations. The boxes below are drawn from the files that actually exist: solid boxes have working code, dashed ones are schema, config or commented-out stubs.
        Counts are read from <code>app/</code>, <code>server/index.ts</code>, <code>prisma/schema.prisma</code> and <code>k8s/</code> at build time.
      </p>
      <div className="wide" style={{ overflowX: 'auto', marginTop: 16 }}>
      <svg className="chart" viewBox={`0 0 960 ${H}`} role="img" aria-label="Planned GitGenie architecture, built parts solid and planned parts dashed">
        <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--muted)" /></marker></defs>
        {[[290, 70, 345, 70], [615, 70, 670, 70], [155, 110, 155, 150], [290, 190, 345, 190], [615, 190, 670, 190]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c - 3} y2={d - (d > b ? 3 : 0)} stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray={i > 1 ? '5 4' : ''} />)}
        {boxes.map((b) => (
          <g key={b.t}>
            <rect x={b.x} y={b.y} width={b.w} height={80} rx="12" fill={b.built ? 'var(--surface-strong)' : 'transparent'} stroke={b.built ? (b.ext ? 'var(--muted)' : 'var(--good)') : 'var(--warn)'} strokeWidth="1.8" strokeDasharray={b.built ? '' : '6 5'} />
            <text x={b.x + 16} y={b.y + 32} style={{ fill: 'var(--text)', fontSize: 15, fontWeight: 700 }}>{b.t}</text>
            <text x={b.x + 16} y={b.y + 56} style={{ fontSize: 13 }}>{b.d}</text>
          </g>
        ))}
        <text x={20} y={H - 6}>solid: code exists · dashed: planned only</text>
      </svg>
      </div>
    </section>
  );
}

function Limits() {
  const items = [
    ['Rules are the repo\'s, not GitHub\'s', 'Thresholds, tiers and which badges still exist are not cited to any GitHub source in the repo. Every verdict here is "by GitGenie\'s rule".'],
    ['Recorded, not live', `PR review counts, merge times, issue timestamps and star counts are a snapshot from ${CAPTURED}. Rerun site/scripts/snapshot-github.mjs to refresh.`],
    ['Still unwired', `detectAchievements is imported by ${stats.engineImporters} pages. YOLO needs per-PR review counts and Pair Extraordinaire needs commit search; the fetcher supplies neither yet.`],
    ['Two rules stay undefined', 'Galaxy Brain needs GitHub Discussions data (GraphQL, token required). Heart On Your Sleeve has three conflicting descriptions, so no spec verdict is computed.'],
    ['Synthetic playground data', 'Slider inputs are turned into minimal search-API-shaped records. Real API responses carry more fields and pagination the engine ignores.'],
    ['No accuracy measurement', `Beyond this repo\'s own ${word(TARGETED, true)} badge attempts, there is no labelled set of accounts to measure detector precision or recall against.`],
  ];
  return (
    <section id="limits" className="card window reveal" data-title="KNOWN_LIMITS.txt">
      <p className="eyebrow">Limitations and threats to validity</p>
      <h2>What this page cannot tell you.</h2>
      <div className="grid2" style={{ marginTop: 16 }}>
        {items.map(([t, d]) => <div className="tile" key={t}><h3>{t}</h3><p className="hint" style={{ margin: '6px 0 0', fontSize: 13 }}>{d}</p></div>)}
      </div>
    </section>
  );
}

function Reproduce() {
  const docs = [
    ['docs/research-review.md', 'Engineering review', 'Graded rubric, fixes, open gaps'],
    ['lib/services/achievements.ts', 'Detector engine', 'The functions this page runs'],
    ['lib/utils/constants.ts', 'Badge rules', 'Source of the catalogue'],
    ['tests/achievements.test.ts', 'Smoke tests', 'npm test, node:test'],
    ['site/src/rules.check.mjs', 'Known-answer check', 'Runs inside npm run build'],
    ['PROJECT_ARCHITECTURE.md', 'Architecture plan', 'The planned full stack'],
  ];
  return (
    <section id="reproduce" className="card window reveal" data-title="Terminal — npm run build">
      <p className="eyebrow">Reproduce it</p>
      <h2>Three commands rebuild every number on this page.</h2>
      <ol className="steps" style={{ marginTop: 16 }}>
        <li><span className="n">1</span><div><b>Build the dashboard</b><div className="hint"><code>git clone {REPO}.git && cd GitGenie/site && npm ci && npm run build</code></div><div className="hint">Regenerates history.json from git log, runs the known-answer check, then builds.</div></div></li>
        <li><span className="n">2</span><div><b>Run the engine tests</b><div className="hint"><code>cd GitGenie && npm test</code></div></div></li>
        <li><span className="n">3</span><div><b>Refresh the recorded snapshot (optional)</b><div className="hint"><code>cd site && node scripts/snapshot-github.mjs</code></div><div className="hint">Free GitHub REST calls through the gh CLI; commit the new JSON with its date.</div></div></li>
      </ol>
      <div className="docs" style={{ marginTop: 20 }}>
        {docs.map(([p, t, d]) => <a key={p} href={blob(p)}><b>{t}</b><small>{d}</small></a>)}
      </div>
    </section>
  );
}
