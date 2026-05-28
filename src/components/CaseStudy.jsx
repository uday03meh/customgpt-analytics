import { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, BarChart2, Route, Zap, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const DASHBOARD_URL = '/gpts/g-6a0f3e130afc8191851f1fcbd820b918-sallutweets/analytics';
const SALLUTWEETS_URL = 'https://chatgpt.com/g/g-6a0f3e130afc8191851f1fcbd820b918-sallutweets';
const LINKEDIN_URL = 'https://www.linkedin.com/in/udaymehtani/';
const GITHUB_URL = 'https://github.com';

// Brand mark — identical to favicon.svg so the tab icon and header logo match
function BrandMark({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="13" width="4" height="7" rx="1.4" fill="currentColor" opacity="0.5" />
      <rect x="10" y="9" width="4" height="11" rx="1.4" fill="currentColor" opacity="0.85" />
      <rect x="16.5" y="5" width="4" height="15" rx="1.4" fill="#F59E0B" />
    </svg>
  );
}

function GitHubLogo({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function XLogo({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ReactLogo({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="-11.5 -10.23 23 20.46" fill="none">
      <circle r="2.05" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function TailwindLogo({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C11.337 13.382 9.976 12 6.001 12z" />
    </svg>
  );
}

const TECH = [
  { name: 'React 18', role: 'UI framework', logo: ReactLogo, color: '#149ECA' },
  { name: 'Tailwind CSS', role: 'Styling', logo: TailwindLogo, color: '#38BDF8' },
  { name: 'Vite', role: 'Build tool', icon: Zap, color: '#A855F7' },
  { name: 'Recharts', role: 'Data viz', icon: BarChart2, color: '#F59E0B' },
  { name: 'React Router', role: 'Routing', icon: Route, color: '#EF4444' },
  { name: 'Claude Code', role: 'Built with', icon: Sparkles, color: '#D97757' },
];

function Mark({ children }) {
  return (
    <mark className="bg-amber-200/60 text-stone-900 rounded px-1 box-decoration-clone">
      {children}
    </mark>
  );
}

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: 'opacity 0.65s ease, transform 0.65s ease',
        transitionDelay: `${delay}ms`,
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(16px)',
      }}
    >
      {children}
    </div>
  );
}

function Frame({ label, icon, children, dot = false, href }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-xl shadow-stone-200/50 bg-white transition-shadow duration-300 hover:shadow-2xl hover:shadow-stone-300/50">
      <div className="bg-stone-100 px-4 py-2.5 flex items-center gap-2 border-b border-stone-200">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
        </div>
        <div className="flex items-center gap-1.5 ml-2 min-w-0">
          {icon}
          <span className="text-[10px] font-mono text-stone-400 truncate">{label}</span>
        </div>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-stone-500 hover:text-amber-700 transition-colors group"
          >
            Open <ArrowUpRight size={11} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        )}
        {dot && !href && <span className="ml-auto w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
      </div>
      {children}
    </div>
  );
}

// Renders a full desktop view of the dashboard, scaled to fit its column. Stays interactive.
function ScaledFrame({ src, title, baseWidth = 1280, baseHeight = 820 }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / baseWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);
  return (
    <div ref={ref} style={{ width: '100%', height: baseHeight * scale, overflow: 'hidden', position: 'relative' }}>
      <iframe
        src={src}
        title={title}
        style={{
          width: baseWidth,
          height: baseHeight,
          border: 'none',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      />
    </div>
  );
}

const ANALYTICS = [
  {
    id: 'overview',
    num: '01',
    title: 'Overview',
    subtitle: 'Engagement KPIs, daily trends, and the activity heatmap',
    metrics: [
      {
        name: 'Total Chats',
        what: 'Total conversation sessions started in the selected period. One chat is counted the moment a user sends a message.',
        why: 'This is the single number OpenAI actually gives creators. Everything else on this dashboard exists because this number, on its own, tells you almost nothing about health.',
      },
      {
        name: 'Unique Users',
        what: 'Distinct active users who started at least one conversation.',
        why: 'Separates reach from raw volume. 1,000 chats from 30 people and 1,000 chats from 800 people are opposite signals, and the chat count cannot tell them apart.',
      },
      {
        name: 'Avg Session',
        what: 'Average session length, measured from the first prompt to the last response.',
        why: 'Read next to message count, it tells you whether people are working through something real or scanning one quick answer and bouncing.',
      },
      {
        name: 'Bounce Rate',
        what: 'Share of sessions that end after a single prompt.',
        why: 'A high bounce almost always means the GPT description sets the wrong expectation. It points you at the intro to fix, not the responses.',
      },
      {
        name: 'Activation Rate',
        what: 'Share of users who take a meaningful action, sending 3 or more messages or invoking a tool, in their first session.',
        why: 'The cleanest read on whether that critical first session actually hooks someone.',
      },
      {
        name: 'Returning Users',
        what: 'Share of users who came back to start another conversation within 7 days.',
        why: 'The strongest single signal that a GPT has value beyond first-day curiosity.',
      },
      {
        name: 'Active Days Grid',
        what: 'A GitHub-style calendar heatmap of daily session volume for the selected month.',
        why: "Lifted straight from GitHub's contribution graph. It reveals whether usage is a steady habit or a one-day spike that a monthly total would completely hide.",
      },
      {
        name: 'Conversation Quality',
        what: 'One card with avg conversation depth, regeneration rate, drop-off after the first message, and the share of sessions over 5 minutes.',
        why: 'Four quality signals at a glance. Regeneration rate especially is a quiet tell that responses keep missing on the first attempt.',
      },
      {
        name: 'Time-of-Day Activity',
        what: 'Session volume across the hours of the day.',
        why: 'Tells you when your users actually show up, which is exactly when you want to ship updates or post about it.',
      },
    ],
  },
  {
    id: 'models',
    num: '02',
    title: 'Models',
    subtitle: 'How sessions split across model versions',
    metrics: [
      {
        name: 'Model Distribution',
        what: 'Share of sessions handled by each model, shown as a donut with a bar per model.',
        why: 'Most creators have no idea which model their users default to. If trivial queries are all landing on the expensive model, your instructions can route them down to mini.',
      },
      {
        name: 'Model Switching Frequency',
        what: 'How often users manually switch models in the middle of a session.',
        why: 'Frequent switching means the default is not meeting expectations. It is a friction signal that usually traces back to an instruction gap.',
      },
      {
        name: 'Session Depth by Model',
        what: 'A per-model table comparing avg conversation depth, avg tokens per session, switch frequency, and overall share.',
        why: 'If the capable model consistently runs deeper threads, people are reaching for it deliberately on the hard tasks. That is real input when you tune your prompt.',
      },
      {
        name: 'Avg Conv. Depth',
        what: 'Mean number of message turns per conversation, broken out by model.',
        why: 'Depth is a direct proxy for how much actual work is happening on each model.',
      },
      {
        name: 'Avg Tokens / Session',
        what: 'Average tokens processed per session for each model.',
        why: 'The cost lever. It shows where token spend concentrates and where mini could safely take over.',
      },
    ],
  },
  {
    id: 'tools',
    num: '03',
    title: 'Tools',
    subtitle: 'Usage, retention impact, and latency per built-in tool',
    metrics: [
      {
        name: 'Tool Usage Overview',
        what: 'Per-tool usage count, session share, retention after use, drop-off after use, and average latency, all in one view.',
        why: 'The fastest way to see which native tools pull their weight and which just add latency for no payoff.',
      },
      {
        name: 'Web Search',
        what: 'Search invocation volume and average time to return results (1.8s here).',
        why: 'Uncontrolled search quietly inflates response time. Heavy use often means the knowledge base is stale and the GPT keeps falling back to live search.',
      },
      {
        name: 'Code Interpreter',
        what: 'Code execution invocations. It has the highest retention (81%) and lowest drop-off (5%) in this GPT.',
        why: 'Sessions that touch code clearly stick. That tells you the capability is worth surfacing more, not less.',
      },
      {
        name: 'Image Generation',
        what: 'DALL-E request volume and latency. At 3.2s average, it is the slowest tool in the set.',
        why: 'The latency leader, so it is the first place to add a loading state instead of leaving people staring at a blank screen.',
      },
      {
        name: 'Canvas',
        what: 'Invocations of the Canvas editing surface. Users who touched it stayed 2.8x longer.',
        why: 'Underused in most GPTs despite the biggest engagement lift. Near-zero usage is almost always an onboarding gap, not a value problem.',
      },
      {
        name: 'Voice Mode',
        what: 'Voice interaction volume and latency (0.6s, the fastest tool here).',
        why: 'Low-volume but very sticky. Worth knowing whether it is a niche power feature or an untapped one.',
      },
      {
        name: 'File Upload',
        what: 'How often users attach files mid-conversation, with retention and drop-off after.',
        why: 'Strong retention after upload signals that people who bring their own context are among your most engaged users.',
      },
      {
        name: 'Tool Invocation Timeline',
        what: 'Daily invocation volume for every built-in tool over time.',
        why: 'Shows whether a tool is a daily habit or a one-off, and surfaces spikes you can tie back to a specific change.',
      },
    ],
  },
  {
    id: 'knowledge',
    num: '04',
    title: 'Knowledge',
    subtitle: 'Per-file retrieval, success, and contribution',
    metrics: [
      {
        name: 'Knowledge File Performance',
        what: 'A row per uploaded file with retrievals, success rate, contribution, sessions continued, abandonment, and latency.',
        why: 'Most creators upload files and never look back. This shows exactly which documents earn their place and which just bloat the context window.',
      },
      {
        name: 'Contribution',
        what: "Each file's share of total retrievals across all conversations.",
        why: 'High contribution means genuinely useful reference material. In this GPT, tone_examples.pdf alone drives 48% of retrievals.',
      },
      {
        name: 'Success Rate',
        what: 'Share of retrievals from a file that returned a usable, relevant chunk.',
        why: 'A low success rate means the file is being pulled but not actually helping, which is worse than not being pulled at all.',
      },
      {
        name: 'Abandonment Rate',
        what: 'Share of conversations that ended right after a file-backed response.',
        why: 'slang_dictionary.pdf abandons 33% of the time here. When one file keeps preceding exits, its content is probably the problem.',
      },
      {
        name: 'Avg Latency',
        what: "Average time to retrieve and inject a file's content into a response.",
        why: 'Retrieval latency stacks on top of model latency. Slow files are a silent tax on every response that touches them.',
      },
      {
        name: 'Retrieval Volume Over Time',
        what: 'Daily volume of knowledge base retrievals, with 7-day, 30-day, and all-time views.',
        why: 'Shows whether the knowledge base is becoming more central to answers over time or fading as the model leans on training instead.',
      },
    ],
  },
  {
    id: 'retention',
    num: '05',
    title: 'Retention',
    subtitle: 'Funnels, cohort retention, and starter performance',
    metrics: [
      {
        name: 'Conversion Funnel',
        what: 'A six-stage journey: GPT page opened, first message sent, second message sent, a tool used, a session over 5 minutes, and returned within 7 days.',
        why: 'Shows exactly where people fall off. A big drop between page-open and first-message is a positioning problem, not a quality one. A drop deeper in usually means the experience runs out of steam.',
      },
      {
        name: 'Conversation Starter Performance',
        what: 'Click-through rate, average conversation depth, and drop-off rate for each starter prompt you configured.',
        why: 'Starters are the one piece of onboarding you fully control. This shows which ones pull people in and which quietly send them away, so you know exactly what to rewrite.',
      },
      {
        name: 'Cohort Retention Heatmap',
        what: "A weekly cohort grid showing Day 1, 7, 14, and 30 return rates for every cohort after their first session.",
        why: 'The classic product-market-fit test. A curve that flattens out instead of decaying to zero is the clearest proof a GPT has recurring value, not just first-day novelty.',
      },
      {
        name: 'Returning Users',
        what: 'The trend of users who came back within 7 days of their first session, with both weekly and monthly views.',
        why: 'The headline retention line. Watching it move week over week is how you actually know whether the changes you ship are landing or not.',
      },
    ],
  },
  {
    id: 'safety',
    num: '06',
    title: 'Safety & Performance',
    subtitle: 'Policy events, refusals, and response latency',
    metrics: [
      {
        name: 'Refusal Rate',
        what: 'Share of user queries that triggered a safety block or refusal (4.2% here).',
        why: 'Too high on a narrow GPT means you are over-restricting real questions. Too low on a broad one can mean your guidelines are exposed to extraction.',
      },
      {
        name: 'Sensitive Topics',
        what: 'Share of queries containing keywords that match monitored policy topics.',
        why: 'Tells you how often people steer into risky territory, which shapes how defensive your instructions actually need to be.',
      },
      {
        name: 'Hallucination Suspicion',
        what: 'Heuristically flagged responses with possible source mismatch or logical inconsistency.',
        why: 'In this GPT the spikes line up with Web Search usage, which is a concrete signal to add citation prompting to the instructions.',
      },
      {
        name: 'Unable to Help',
        what: 'Rate at which the model says it cannot do the requested task or fetch the info.',
        why: 'A different failure from a refusal. A rising rate usually means users want something the GPT was never set up to do, which is a roadmap hint.',
      },
      {
        name: 'Policy Events Over Time',
        what: 'Daily refusals and sensitive-content detections plotted together.',
        why: 'Lets you tie a spike to a specific day, which is usually how you trace it back to a prompt change or a wave of adversarial users.',
      },
      {
        name: 'Refusal Categories',
        what: 'The top reasons refusals were triggered, ranked by share.',
        why: 'Turns a single refusal number into something actionable by showing what is actually being refused.',
      },
      {
        name: 'Latency & Performance',
        what: 'Avg response time, avg tool delay, avg retrieval latency, P95 response time, and the slowest workflows.',
        why: 'P95 is the metric that matters. The average looks fine while the slowest 5% of responses are quietly driving people away.',
      },
    ],
  },
];

const TABS = [
  { id: 'project', label: 'What It Is', short: 'Overview' },
  { id: 'story', label: 'How It Started', short: 'Story' },
  { id: 'build', label: 'How It Was Built', short: 'Build' },
];

export default function CaseStudy() {
  const [activeTab, setActiveTab] = useState('project');
  const [tabVisible, setTabVisible] = useState(true);
  const [selectedSection, setSelectedSection] = useState(ANALYTICS[0].id);
  const [expandedMetric, setExpandedMetric] = useState(ANALYTICS[0].metrics[0].name);
  const tabTimer = useRef(null);

  useEffect(() => {
    const prev = document.body.style.cssText;
    document.body.style.backgroundColor = '#F9F7F2';
    document.body.style.color = '#1C1917';
    return () => { document.body.style.cssText = prev; };
  }, []);

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    clearTimeout(tabTimer.current);
    setTabVisible(false);
    tabTimer.current = setTimeout(() => {
      setActiveTab(tab);
      setTabVisible(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 160);
  };

  const activeSection = ANALYTICS.find(s => s.id === selectedSection);
  const expandedData = activeSection?.metrics.find(m => m.name === expandedMetric) || activeSection?.metrics[0];

  const selectSection = (id) => {
    setSelectedSection(id);
    const sec = ANALYTICS.find(s => s.id === id);
    setExpandedMetric(sec.metrics[0].name);
  };

  const tabButtons = (mobile = false) =>
    TABS.map(tab => (
      <button
        key={tab.id}
        onClick={() => switchTab(tab.id)}
        className={clsx(
          'px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-150 active:scale-[0.97]',
          mobile && 'flex-1',
          activeTab === tab.id
            ? 'bg-white text-stone-900 shadow-sm'
            : 'text-stone-500 hover:text-stone-800'
        )}
      >
        {mobile ? tab.short : tab.label}
      </button>
    ));

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-stone-900 antialiased flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-[#F9F7F2]/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => switchTab('project')}
            aria-label="Home"
            className="shrink-0 w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center hover:bg-stone-700 transition-colors active:scale-95"
          >
            <BrandMark className="w-[18px] h-[18px]" />
          </button>

          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-stone-200/60 rounded-xl p-1">
            {tabButtons()}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white border border-stone-200 hover:border-stone-300 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-all shadow-sm active:scale-[0.97]"
            >
              <GitHubLogo className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href={DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-stone-900 hover:bg-amber-700 text-xs font-bold text-white transition-all shadow-sm active:scale-[0.97] group"
            >
              <span className="hidden sm:inline">Explore Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
              <ArrowRight size={12} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-1 px-5 pb-2.5 -mt-1">
          <div className="flex w-full gap-1 bg-stone-200/60 rounded-xl p-1">
            {tabButtons(true)}
          </div>
        </nav>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-8 py-14 sm:py-16">
        <div
          style={{
            opacity: tabVisible ? 1 : 0,
            transform: tabVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
        >

          {/* ═══════════ WHAT IT IS ═══════════ */}
          {activeTab === 'project' && (
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center lg:min-h-[68vh]">
              {/* LEFT — text */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                  <span className="text-[12.5px] font-semibold text-stone-600 tracking-tight">
                    A concept dashboard, built from a real problem
                  </span>
                </div>

                <h1 className="text-[2.35rem] sm:text-[2.9rem] lg:text-[3.05rem] font-extrabold tracking-tighter leading-[1.05] text-stone-900">
                  OpenAI forgot to build an analytics page for their custom GPTs.
                  <br />
                  <span className="relative inline-block text-amber-700">
                    I built one myself.
                    <span className="absolute left-0 -bottom-1 w-full h-[6px] bg-amber-300/50 rounded-full -z-0" />
                  </span>
                </h1>

                <p className="text-lg text-stone-600 leading-relaxed">
                  A working dashboard concept for what creator analytics{' '}
                  <Mark>should actually look like</Mark>. Sessions, retention, tool usage,
                  models, and everything else OpenAI never shipped.
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-[15px] text-stone-500">
                  <span><strong className="text-stone-900 font-bold">6</strong> sections</span>
                  <span className="text-stone-300">·</span>
                  <span><strong className="text-stone-900 font-bold">30+</strong> metrics</span>
                  <span className="text-stone-300">·</span>
                  <span><strong className="text-stone-900 font-bold">Fully</strong> interactive</span>
                </div>
              </div>

              {/* RIGHT — live dashboard */}
              <div className="lg:col-span-7">
                <FadeUp delay={60}>
                  <Frame
                    label="sallutweets / analytics"
                    icon={<BarChart2 size={11} className="text-amber-600" />}
                    href={DASHBOARD_URL}
                  >
                    <ScaledFrame src={DASHBOARD_URL} title="Custom GPT Analytics Dashboard" />
                  </Frame>
                  <p className="text-center text-[12px] text-stone-400 mt-3">
                    This is the real dashboard, running live. Scroll and click inside it.
                  </p>
                </FadeUp>
              </div>
            </div>
          )}

          {/* ═══════════ HOW IT STARTED ═══════════ */}
          {activeTab === 'story' && (
            <div className="max-w-2xl mx-auto space-y-20">

              <FadeUp>
                <div className="space-y-6">
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">How It Started</h2>
                  <div className="space-y-5 text-[17px] text-stone-700 leading-[1.75]">
                    <p>
                      One evening, scrolling X, vintage 2010 Salman Khan tweets started flooding my
                      timeline. Phonetic spelling, surreal one-liners, the kind of thing that is{' '}
                      <Mark>genuinely legendary</Mark> in Indian internet culture.
                    </p>
                    <p>
                      I collected about 50 of the most iconic ones and turned them into a custom GPT.
                      I fed the set to Claude, wrote the system instructions and a behavioral profile,
                      and uploaded it all to OpenAI's creator portal.
                    </p>
                    <p>
                      I shipped it as <strong className="text-stone-900 font-bold">SalluTweets</strong>:
                      a GPT that replies the way Salman Khan tweeted in 2010. Raw, phonetic, completely
                      chaotic.
                    </p>
                  </div>
                  <Frame
                    label="SalluTweets GPT"
                    icon={<XLogo className="w-3 h-3 text-stone-400" />}
                    href={SALLUTWEETS_URL}
                  >
                    <img src="/sallutweets-screenshot.png" alt="SalluTweets in action" className="w-full block" />
                  </Frame>
                </div>
              </FadeUp>

              <FadeUp delay={80}>
                <div className="space-y-6">
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">The Problem</h2>
                  <div className="space-y-5 text-[17px] text-stone-700 leading-[1.75]">
                    <p>
                      It caught on fast.{' '}
                      <Mark>Over 90 active users in the first 24 hours</Mark> after going public.
                    </p>
                    <p>
                      So I opened the OpenAI creator panel to see how it was doing. The entire
                      analytics page was one number:{' '}
                      <strong className="text-amber-700 font-bold">"80+ Chats."</strong>
                    </p>
                    <p>
                      No daily trend. No retention. No tool usage. No session depth. Nothing. Coming
                      from a product background where every call is made on data, this felt like an
                      absurd gap in a creator tool.
                    </p>
                    <p className="text-stone-900 font-semibold">
                      So I designed what it should have looked like.
                    </p>
                  </div>
                  <Frame
                    label="OpenAI creator panel"
                    icon={<BarChart2 size={11} className="text-stone-400" />}
                  >
                    <img src="/my-gpts-screenshot.png" alt="OpenAI panel showing only 80+ Chats" className="w-full block" />
                  </Frame>
                </div>
              </FadeUp>

            </div>
          )}

          {/* ═══════════ HOW IT WAS BUILT ═══════════ */}
          {activeTab === 'build' && (
            <div className="max-w-4xl mx-auto space-y-20">

              {/* Chapter 01 */}
              <FadeUp>
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="shrink-0 w-10 h-10 rounded-full bg-stone-900 text-white text-xs font-bold font-mono flex items-center justify-center">01</span>
                    <span className="h-px flex-1 bg-stone-200" />
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
                    Choosing the Right Metrics
                  </h2>
                  <div className="space-y-5 text-[17px] text-stone-700 leading-[1.75] max-w-2xl">
                    <p>
                      I started by asking ChatGPT for every metric you could possibly track from a
                      user talking to a model. It gave me 40+ of them. I went through each one by
                      hand and asked three questions: what does it really measure, is it just a{' '}
                      <Mark>vanity number</Mark>, and could a creator actually do something about it?
                    </p>
                    <p>
                      The activity heatmap came straight from{' '}
                      <strong className="text-stone-900 font-bold">GitHub's contribution graph</strong>.
                      The cohort grid came from standard SaaS retention frameworks. What made the cut
                      was <strong className="text-stone-900 font-bold">6 sections covering the full
                        user lifecycle</strong>, from first click to long-term retention to what breaks.
                    </p>
                  </div>
                </section>
              </FadeUp>

              {/* Chapter 02 */}
              <FadeUp delay={60}>
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="shrink-0 w-10 h-10 rounded-full bg-stone-900 text-white text-xs font-bold font-mono flex items-center justify-center">02</span>
                    <span className="h-px flex-1 bg-stone-200" />
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
                    The 6 Analytics Sections
                  </h2>
                  <p className="text-[17px] text-stone-600 max-w-2xl leading-relaxed">
                    These are the exact sections in the live dashboard. Pick one, then tap through its
                    metrics to see what each tracks and why it earned a place.
                  </p>

                  <div className="flex flex-col lg:flex-row gap-3 pt-2">
                    <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 shrink-0 lg:w-60">
                      {ANALYTICS.map(s => (
                        <button
                          key={s.id}
                          onClick={() => selectSection(s.id)}
                          className={clsx(
                            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink active:scale-[0.98]',
                            selectedSection === s.id
                              ? 'bg-stone-900 text-white shadow-sm'
                              : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900'
                          )}
                        >
                          <span className={clsx(
                            'text-[10px] font-mono shrink-0 transition-colors',
                            selectedSection === s.id ? 'text-amber-400' : 'text-stone-400'
                          )}>
                            {s.num}
                          </span>
                          {s.title}
                        </button>
                      ))}
                    </div>

                    {activeSection && (
                      <div className="flex-1 bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
                        <div>
                          <h3 className="text-2xl font-bold text-stone-900 tracking-tight">{activeSection.title}</h3>
                          <p className="text-[15px] text-stone-500 mt-1">{activeSection.subtitle}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {activeSection.metrics.map(m => (
                            <button
                              key={m.name}
                              onClick={() => setExpandedMetric(m.name)}
                              className={clsx(
                                'px-3.5 py-2 rounded-lg text-[13px] font-semibold border transition-all active:scale-95',
                                expandedData?.name === m.name
                                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400 hover:text-stone-900 hover:bg-white'
                              )}
                            >
                              {m.name}
                            </button>
                          ))}
                        </div>

                        {expandedData && (
                          <div className="bg-gradient-to-br from-stone-50 to-amber-50/40 border border-stone-200 rounded-xl p-6 space-y-5">
                            <div className="space-y-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">What it tracks</span>
                              <p className="text-[16px] text-stone-800 leading-[1.7]">{expandedData.what}</p>
                            </div>
                            <div className="border-t border-stone-200/80 pt-5 space-y-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Why it matters</span>
                              <p className="text-[16px] text-stone-800 leading-[1.7]">{expandedData.why}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </FadeUp>

              {/* Chapter 03 */}
              <FadeUp delay={120}>
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="shrink-0 w-10 h-10 rounded-full bg-stone-900 text-white text-xs font-bold font-mono flex items-center justify-center">03</span>
                    <span className="h-px flex-1 bg-stone-200" />
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
                    The Stack
                  </h2>
                  <p className="text-[17px] text-stone-700 leading-[1.75] max-w-2xl">
                    <Mark>Not a single line of code written by hand.</Mark> The whole frontend was
                    built with Claude Code. My job was the product layer: deciding which metrics
                    matter, how to show them, and iterating until it felt right. It is a front-end
                    MVP on mock data, not wired to any live OpenAI API.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {TECH.map(({ name, role, logo: Logo, icon: Icon, color }) => (
                      <div
                        key={name}
                        className="flex items-center gap-3 px-4 py-3.5 bg-white border border-stone-200 rounded-xl shadow-sm hover:border-stone-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <span
                          className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${color}1A`, color }}
                        >
                          {Logo ? <Logo className="w-[18px] h-[18px]" /> : <Icon size={18} strokeWidth={2.2} />}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-stone-900 truncate">{name}</p>
                          <p className="text-[11px] text-stone-400">{role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeUp>

            </div>
          )}

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-center">
          <p className="text-[13px] text-stone-500 flex items-center gap-1.5 flex-wrap justify-center text-center">
            Built with <span className="text-red-500">❤️</span> by
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-stone-900 hover:text-amber-700 underline decoration-amber-300 decoration-2 underline-offset-2 transition-colors"
            >
              Uday Mehtani (Claude Code)
            </a>
          </p>
        </div>
      </footer>

    </div>
  );
}
