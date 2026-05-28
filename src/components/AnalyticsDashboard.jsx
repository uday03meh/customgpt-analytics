import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Globe, Lock, RefreshCw, Download, Calendar,
  MessageSquare, Users, TrendingUp, Zap, Clock, BarChart2,
  Search, ImageIcon, Mic, FileText, Database,
  ChevronDown, Activity, RotateCcw, Info, CheckCircle2,
  AlertCircle, Share2, Shield,
  Code, Volume2, Upload, PenLine,
  TrendingDown, Eye, ToggleLeft, ToggleRight,
  ArrowUpRight, ArrowDownRight, Cpu, Layers, ExternalLink,
  Sparkles, X
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell
} from 'recharts';
import { analyticsData } from '../data/mockData';
import clsx from 'clsx';

const TABS = [
  { id: 'Overview',   label: 'Overview'   },
  { id: 'Models',     label: 'Models'     },
  { id: 'Tools',      label: 'Tools'      },
  { id: 'Knowledge',  label: 'Knowledge'  },
  { id: 'Retention',  label: 'Retention'  },
  { id: 'Safety',     label: 'Safety & Performance'  },
];

// ─── SMART TOOLTIP HOOK ──────────────────────────────────────────────────────
// Determines if tooltip should appear above or below based on button position
function useSmartTooltip() {
  const ref = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState('above'); // 'above' or 'below'

  const handleEnter = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // If button is in the top 40% of viewport, show tooltip below
      if (rect.top < viewportHeight * 0.4) {
        setPosition('below');
      } else {
        setPosition('above');
      }
    }
    setShowTooltip(true);
  }, []);

  const handleLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  return { ref, showTooltip, position, handleEnter, handleLeave };
}

// ─── SMART TOOLTIP COMPONENT ─────────────────────────────────────────────────
function SmartTooltip({ text, position, align = 'center' }) {
  const isBelow = position === 'below';
  const alignClass = align === 'right'
    ? 'right-0'
    : 'left-1/2 -translate-x-1/2';
  const arrowAlignClass = align === 'right'
    ? 'right-4'
    : 'left-1/2 -translate-x-1/2';

  return (
    <div
      className={clsx(
        'absolute z-[9999] w-64 p-3 bg-[#1e1e20] border border-[#3a3a3c] rounded-lg shadow-2xl text-[11px] text-[#e4e4e7] normal-case tracking-normal font-normal leading-relaxed text-left animate-in fade-in zoom-in-95 duration-100',
        alignClass,
        isBelow ? 'top-full mt-2' : 'bottom-full mb-2'
      )}
    >
      {text}
      <div
        className={clsx(
          'absolute border-4 border-transparent',
          arrowAlignClass,
          isBelow
            ? 'bottom-full border-b-[#1e1e20]'
            : 'top-full border-t-[#1e1e20]'
        )}
      />
    </div>
  );
}

// ─── Shared chart tooltip ─────────────────────────────────────────────────────
const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 shadow-2xl">
      <p className="text-[11px] text-[#a1a1aa] mb-1.5 font-medium">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color || p.fill || p.stroke }} />
          <span className="text-[#a1a1aa]">{p.name}:</span>
          <span className="text-[#e4e4e7] font-semibold">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Reusable card shells ─────────────────────────────────────────────────────
function Card({ title, subtitle, action, children, className = '', info }) {
  const tooltip = useSmartTooltip();
  return (
    <div className={clsx('bg-[#141414] border border-[#262626] rounded-xl shadow-sm relative', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f1f]">
          <div className="flex-1 pr-4">
            {title && (
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-[#ffffff] tracking-tight">{title}</h3>
                {info && (
                  <div className="relative" ref={tooltip.ref}>
                    <button 
                      onMouseEnter={tooltip.handleEnter}
                      onMouseLeave={tooltip.handleLeave}
                      className="text-[#525252] hover:text-[#e4e4e7] transition-colors shrink-0 flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#262626]"
                    >
                      <Info size={12} />
                    </button>
                    {tooltip.showTooltip && (
                      <SmartTooltip text={info} position={tooltip.position} />
                    )}
                  </div>
                )}
              </div>
            )}
            {subtitle && <p className="text-[11px] text-[#a1a1aa] mt-0.5 font-medium">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function KPI({ label, value, trend, icon: Icon, accent = '#19c37d', definition, hideTrend }) {
  const tooltip = useSmartTooltip();
  const up = trend > 0;
  return (
    <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 hover:border-[#383838] transition-all duration-200 relative group card-hover">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider leading-tight">{label}</span>
          {definition && (
            <div className="relative" ref={tooltip.ref}>
              <button 
                onMouseEnter={tooltip.handleEnter}
                onMouseLeave={tooltip.handleLeave}
                className="text-[#525252] hover:text-[#e4e4e7] transition-colors shrink-0 flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#262626]"
                title="View details"
              >
                <Info size={12} />
              </button>
              {tooltip.showTooltip && (
                <SmartTooltip text={definition} position={tooltip.position} />
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: accent + '18' }}>
            <Icon size={14} style={{ color: accent }} />
          </div>
        )}
      </div>
      <p className="text-[26px] font-extrabold text-[#ffffff] tracking-tight leading-none kpi-value">{value}</p>
      {!hideTrend && trend !== undefined && (
        <div className="flex items-center gap-1 mt-2.5">
          {up
            ? <ArrowUpRight size={12} className="text-[#19c37d]" />
            : <ArrowDownRight size={12} className="text-red-400" />
          }
          <span className={clsx('text-xs font-semibold', up ? 'text-[#19c37d]' : 'text-red-400')}>
            {up ? '+' : ''}{trend}%
          </span>
          <span className="text-xs font-medium text-[#71717a]">vs last period</span>
        </div>
      )}
    </div>
  );
}

// ─── CSV EXPORT ───────────────────────────────────────────────────────────────
function exportCSV(gpt, data) {
  const ts = new Date().toISOString();
  const headers = ["GPT ID", "GPT Name", "Category", "Metric", "Date/Dimension", "Value", "Unit", "Export Timestamp"];
  
  const records = [
    [gpt.id, gpt.name, "KPI", "Total Chats", "All Time", data.kpis.totalChats, "Count", ts],
    [gpt.id, gpt.name, "KPI", "Unique Users", "All Time", data.kpis.uniqueUsers, "Count", ts],
    [gpt.id, gpt.name, "KPI", "Avg Messages / Convo", "All Time", data.kpis.avgMessagesPerConvo, "Count", ts],
    [gpt.id, gpt.name, "KPI", "Avg Tokens / Session", "All Time", data.kpis.avgTokensPerSession, "Count", ts],
    [gpt.id, gpt.name, "KPI", "Bounce Rate", "All Time", data.kpis.bounceRate, "%", ts],
    [gpt.id, gpt.name, "KPI", "Activation Rate", "All Time", data.kpis.activationRate, "%", ts],
    [gpt.id, gpt.name, "KPI", "Returning Users", "All Time", data.kpis.returningUsers, "%", ts],
    [gpt.id, gpt.name, "KPI", "Avg Session Length", "All Time", data.kpis.avgSessionLength, "Duration", ts],
    [gpt.id, gpt.name, "KPI", "Avg Response Time", "All Time", data.kpis.avgResponseTime, "Seconds", ts],
  ];

  if (data.dailyChats) {
    data.dailyChats.forEach(d => {
      records.push([gpt.id, gpt.name, "Daily Active Chats", "Chats", d.date, d.chats, "Count", ts]);
      records.push([gpt.id, gpt.name, "Daily Active Chats", "Unique Users", d.date, d.users, "Count", ts]);
    });
  }

  if (data.weeklyGrowth) {
    data.weeklyGrowth.forEach(w => {
      records.push([gpt.id, gpt.name, "Weekly Growth %", "Growth Rate", w.week, w.growth, "%", ts]);
    });
  }

  if (data.conversationQuality) {
    const q = data.conversationQuality;
    records.push([gpt.id, gpt.name, "Conversation Quality", "Avg Conv. Depth", "All Time", q.avgDepth, "Messages", ts]);
    records.push([gpt.id, gpt.name, "Conversation Quality", "Regeneration Rate", "All Time", q.regenerationRate, "%", ts]);
    records.push([gpt.id, gpt.name, "Conversation Quality", "Drop-off After 1st", "All Time", q.dropOffAfterFirst, "%", ts]);
    records.push([gpt.id, gpt.name, "Conversation Quality", "Long Sessions >5m", "All Time", q.longSessionPct, "%", ts]);
  }

  if (data.tokenStats) {
    const t = data.tokenStats;
    records.push([gpt.id, gpt.name, "Token & Prompt Stats", "Avg Prompt Length", "All Time", t.avgPromptLength, "Words", ts]);
    records.push([gpt.id, gpt.name, "Token & Prompt Stats", "Avg Input Tokens", "All Time", t.avgInputTokens, "Tokens", ts]);
    records.push([gpt.id, gpt.name, "Token & Prompt Stats", "Avg Output Tokens", "All Time", t.avgOutputTokens, "Tokens", ts]);
    records.push([gpt.id, gpt.name, "Token & Prompt Stats", "Convos / User", "All Time", t.avgConvosPerUser, "Count", ts]);
  }

  if (data.modelUsage) {
    data.modelUsage.forEach(m => {
      records.push([gpt.id, gpt.name, "Model Distribution", "Usage Share", m.model, m.usage, "%", ts]);
      records.push([gpt.id, gpt.name, "Model Distribution", "Avg Conv. Depth", m.model, m.avgDepth, "Messages", ts]);
      records.push([gpt.id, gpt.name, "Model Distribution", "Avg Tokens", m.model, m.avgTokens, "Tokens", ts]);
      records.push([gpt.id, gpt.name, "Model Distribution", "Switch Frequency", m.model, m.switchFreq, "Ratio", ts]);
    });
  }

  if (data.toolUsage) {
    data.toolUsage.forEach(tool => {
      records.push([gpt.id, gpt.name, "Tool Usage", "Usage Count", tool.tool, tool.count, "Count", ts]);
      records.push([gpt.id, gpt.name, "Tool Usage", "Usage Share", tool.tool, tool.pct, "%", ts]);
      records.push([gpt.id, gpt.name, "Tool Usage", "Retention After", tool.tool, tool.retentionAfter, "%", ts]);
      records.push([gpt.id, gpt.name, "Tool Usage", "Drop-off After", tool.tool, tool.dropOffAfter, "%", ts]);
      records.push([gpt.id, gpt.name, "Tool Usage", "Avg Latency", tool.tool, tool.avgLatency, "Seconds", ts]);
    });
  }

  if (data.knowledgeFiles) {
    data.knowledgeFiles.forEach(file => {
      records.push([gpt.id, gpt.name, "Knowledge Base Performance", "Retrievals", file.name, file.retrievals, "Count", ts]);
      records.push([gpt.id, gpt.name, "Knowledge Base Performance", "Success Rate", file.name, file.successRate, "%", ts]);
      records.push([gpt.id, gpt.name, "Knowledge Base Performance", "Avg Latency", file.name, file.avgLatency, "Seconds", ts]);
      records.push([gpt.id, gpt.name, "Knowledge Base Performance", "Contribution Pct", file.name, file.contributionPct, "%", ts]);
      records.push([gpt.id, gpt.name, "Knowledge Base Performance", "Abandonment Rate", file.name, file.abandoned, "%", ts]);
    });
  }

  if (data.starterPrompts) {
    data.starterPrompts.forEach(sp => {
      records.push([gpt.id, gpt.name, "Starter Prompts", "Sessions Triggered", sp.prompt, sp.sessions, "Count", ts]);
      records.push([gpt.id, gpt.name, "Starter Prompts", "Click-Through Rate (CTR)", sp.prompt, sp.ctr, "%", ts]);
      records.push([gpt.id, gpt.name, "Starter Prompts", "Avg Depth", sp.prompt, sp.avgDepth, "Messages", ts]);
      records.push([gpt.id, gpt.name, "Starter Prompts", "Drop-off Rate", sp.prompt, sp.dropOff, "%", ts]);
    });
  }

  if (data.funnel) {
    data.funnel.forEach((f, i) => {
      records.push([gpt.id, gpt.name, "Conversion Funnel", "Stage Count", `${i + 1}. ${f.stage}`, f.count, "Count", ts]);
      records.push([gpt.id, gpt.name, "Conversion Funnel", "Conversion Share", `${i + 1}. ${f.stage}`, f.pct, "%", ts]);
    });
  }

  if (data.retentionCohorts) {
    data.retentionCohorts.forEach(row => {
      records.push([gpt.id, gpt.name, "Cohort Retention Heatmap", "Day 1 Retention", row.cohort, row.d1, "%", ts]);
      records.push([gpt.id, gpt.name, "Cohort Retention Heatmap", "Day 7 Retention", row.cohort, row.d7, "%", ts]);
      records.push([gpt.id, gpt.name, "Cohort Retention Heatmap", "Day 14 Retention", row.cohort, row.d14, "%", ts]);
      records.push([gpt.id, gpt.name, "Cohort Retention Heatmap", "Day 30 Retention", row.cohort, row.d30, "%", ts]);
    });
  }

  if (data.safety) {
    const s = data.safety;
    records.push([gpt.id, gpt.name, "Safety & Performance", "Refusal Rate", "All Time", s.refusalRate, "%", ts]);
    records.push([gpt.id, gpt.name, "Safety & Performance", "Sensitive Topics Rate", "All Time", s.sensitiveTopicRate, "%", ts]);
    records.push([gpt.id, gpt.name, "Safety & Performance", "Hallucination Suspicion", "All Time", s.hallucinationSuspicion, "%", ts]);
    records.push([gpt.id, gpt.name, "Safety & Performance", "Unable to Help Rate", "All Time", s.unableToHelpRate, "%", ts]);
    
    if (s.refusalsByDay) {
      s.refusalsByDay.forEach(r => {
        records.push([gpt.id, gpt.name, "Safety Refusals Timeline", "Refusals Count", r.date, r.refusals, "Count", ts]);
        records.push([gpt.id, gpt.name, "Safety Refusals Timeline", "Sensitive Count", r.date, r.sensitive, "Count", ts]);
      });
    }

    if (s.topRefusalCategories) {
      s.topRefusalCategories.forEach(cat => {
        records.push([gpt.id, gpt.name, "Policy Refusal Categories", "Refusals Count", cat.category, cat.count, "Count", ts]);
        records.push([gpt.id, gpt.name, "Policy Refusal Categories", "Percentage Share", cat.category, cat.pct, "%", ts]);
      });
    }

    if (s.latency) {
      records.push([gpt.id, gpt.name, "System Performance Latency", "Avg Response Time", "All Time", s.latency.avgResponseTime, "Seconds", ts]);
      records.push([gpt.id, gpt.name, "System Performance Latency", "Avg Tool Delay", "All Time", s.latency.avgToolDelay, "Seconds", ts]);
      records.push([gpt.id, gpt.name, "System Performance Latency", "Avg Retrieval Latency", "All Time", s.latency.avgRetrievalLatency, "Seconds", ts]);
      records.push([gpt.id, gpt.name, "System Performance Latency", "P95 Response Time", "All Time", s.latency.p95ResponseTime, "Seconds", ts]);
    }
  }

  const rows = [headers, ...records];
  const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${gpt.id}-relational-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── METRIC DEFINITIONS ──────────────────────────────────────────────────────
const METRIC_DEFINITIONS = {
  'Total Chats': "The total number of conversation sessions started by users. A conversation is counted when a user sends at least one message.",
  'Unique Users': "The total number of distinct active users who have interacted with this custom GPT within the selected period.",
  'Avg Session': "The average duration of user sessions. Measured from the first prompt sent until the last response, excluding inactivity.",
  'Msgs / Convo': "The average number of messages (prompts) exchanged in a single conversation. Higher numbers indicate deep engagement.",
  'Activation Rate': "The percentage of users who take a meaningful action—defined as sending at least 3 messages or invoking a custom tool—in their first session.",
  'Returning Users': "The percentage of unique users who returned to start another conversation within 7 days of their initial session.",
  'Bounce Rate': "The percentage of sessions that end after only one prompt from the user, indicating they didn't find the response engaging or helpful.",
  'Avg Tokens / Session': "The average volume of computational tokens (words/characters) processed per session, including both user prompts and model responses."
};

// ─── DYNAMIC KPI CALCULATOR ──────────────────────────────────────────────────
const getKpisForPeriod = (baseKpis, period) => {
  let multiplier = 1.0;
  let trendMult = 1.0;
  
  if (period === '1d') {
    multiplier = 0.033;
    trendMult = 0.2;
  } else if (period === '7d') {
    multiplier = 0.23;
    trendMult = 0.5;
  } else if (period === '30d') {
    multiplier = 1.0;
    trendMult = 1.0;
  } else if (period === '7w') {
    multiplier = 1.63;
    trendMult = 1.3;
  } else if (period === '1m') {
    multiplier = 1.05;
    trendMult = 1.0;
  } else if (period === 'all') {
    multiplier = 3.25;
    trendMult = 2.5;
  }

  const totalChats = Math.round(baseKpis.totalChats * multiplier);
  const uniqueUsers = Math.round(baseKpis.uniqueUsers * multiplier);
  const avgTokensPerSession = Math.round(baseKpis.avgTokensPerSession * (1 + (multiplier - 1) * 0.02));
  
  let bounceRate = baseKpis.bounceRate;
  let activationRate = baseKpis.activationRate;
  let returningUsers = baseKpis.returningUsers;
  let avgSessionLength = baseKpis.avgSessionLength;
  let avgMessagesPerConvo = baseKpis.avgMessagesPerConvo;

  if (period === '1d') {
    bounceRate = Math.min(100, Math.round(bounceRate * 1.08));
    activationRate = Math.max(0, Math.round(activationRate * 0.94));
    returningUsers = Math.max(0, Math.round(returningUsers * 0.88));
    avgSessionLength = '3m 15s';
    avgMessagesPerConvo = (avgMessagesPerConvo * 0.9).toFixed(1);
  } else if (period === '7d') {
    bounceRate = Math.min(100, Math.round(bounceRate * 1.03));
    activationRate = Math.max(0, Math.round(activationRate * 0.98));
    returningUsers = Math.max(0, Math.round(returningUsers * 0.95));
    avgSessionLength = '3m 30s';
    avgMessagesPerConvo = (avgMessagesPerConvo * 0.96).toFixed(1);
  } else if (period === '7w') {
    bounceRate = Math.max(0, Math.round(bounceRate * 0.95));
    activationRate = Math.min(100, Math.round(activationRate * 1.02));
    returningUsers = Math.min(100, Math.round(returningUsers * 1.04));
    avgSessionLength = '3m 52s';
    avgMessagesPerConvo = (avgMessagesPerConvo * 1.03).toFixed(1);
  } else if (period === 'all') {
    bounceRate = Math.max(0, Math.round(bounceRate * 0.9));
    activationRate = Math.min(100, Math.round(activationRate * 1.05));
    returningUsers = Math.min(100, Math.round(returningUsers * 1.08));
    avgSessionLength = '4m 05s';
    avgMessagesPerConvo = (avgMessagesPerConvo * 1.06).toFixed(1);
  }

  const getTrend = (baseTrend) => {
    return Math.round(baseTrend * trendMult);
  };

  return {
    totalChats,
    uniqueUsers,
    avgMessagesPerConvo,
    avgTokensPerSession,
    bounceRate,
    activationRate,
    returningUsers,
    avgSessionLength,
    totalChatsTrend: getTrend(18),
    uniqueUsersTrend: getTrend(12),
    msgsTrend: getTrend(5),
    activationTrend: getTrend(6),
    returningTrend: getTrend(8),
    bounceTrend: getTrend(-3)
  };
};

// ─── DYNAMIC DAILY CHATS SELECTOR ────────────────────────────────────────────
const getDailyChatsForPeriod = (period) => {
  if (period === '1d') {
    return [
      { date: '12 AM', chats: 12, users: 8 },
      { date: '3 AM', chats: 4, users: 3 },
      { date: '6 AM', chats: 8, users: 5 },
      { date: '9 AM', chats: 24, users: 16 },
      { date: '12 PM', chats: 45, users: 32 },
      { date: '3 PM', chats: 38, users: 26 },
      { date: '6 PM', chats: 54, users: 38 },
      { date: '9 PM', chats: 62, users: 44 },
    ];
  } else if (period === '7d') {
    return [
      { date: 'May 17', chats: 390, users: 241 },
      { date: 'May 18', chats: 447, users: 289 },
      { date: 'May 19', chats: 421, users: 276 },
      { date: 'May 20', chats: 315, users: 202 },
      { date: 'May 21', chats: 289, users: 184 },
      { date: 'May 22', chats: 503, users: 318 },
      { date: 'May 23', chats: 481, users: 301 },
    ];
  } else if (period === '7w') {
    return [
      { date: 'Week 1', chats: 1200, users: 780 },
      { date: 'Week 2', chats: 1450, users: 910 },
      { date: 'Week 3', chats: 1620, users: 1040 },
      { date: 'Week 4', chats: 1980, users: 1220 },
      { date: 'Week 5', chats: 2410, users: 1540 },
      { date: 'Week 6', chats: 2890, users: 1810 },
      { date: 'Week 7', chats: 3420, users: 2150 },
    ];
  } else if (period === 'all') {
    return [
      { date: 'Dec', chats: 4200, users: 2100 },
      { date: 'Jan', chats: 5800, users: 2900 },
      { date: 'Feb', chats: 7200, users: 3400 },
      { date: 'Mar', chats: 8900, users: 4100 },
      { date: 'Apr', chats: 11200, users: 5200 },
      { date: 'May', chats: 14700, users: 6800 },
    ];
  } else {
    const res = [];
    for (let i = 1; i <= 30; i++) {
      const day = i < 10 ? `0${i}` : i;
      const base = 250 + Math.sin(i * 0.5) * 80 + (i * 4);
      const chats = Math.round(base);
      const users = Math.round(base * 0.63);
      res.push({
        date: `May ${day}`,
        chats,
        users
      });
    }
    return res;
  }
};

// ─── DATE PICKER DROPDOWN ────────────────────────────────────────────────────
function DatePicker({ selectedPeriod, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: '1d', label: '1 Day' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '7w', label: '7 Weeks' },
    { value: '1m', label: '1 Month' },
    { value: 'all', label: 'All Time' }
  ];

  const currentLabel = options.find(o => o.value === selectedPeriod)?.label || '30 Days';

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-[#262626] hover:border-[#383838] rounded-lg text-xs text-[#ffffff] font-medium transition-colors"
      >
        <Calendar size={12} className="text-[#8e8ea0]" />
        {currentLabel}
        <ChevronDown size={11} className="text-[#8e8ea0]" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-45" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-36 bg-[#1c1c1e] border border-[#2d2d2d] rounded-lg shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  "w-full text-left px-3 py-1.5 text-xs transition-colors",
                  selectedPeriod === opt.value 
                    ? "bg-[#19c37d]/10 text-[#19c37d] font-semibold" 
                    : "text-[#d4d4d8] hover:bg-[#262626] hover:text-[#ffffff]"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── GITHUB-STYLE ACTIVITY GRID ──────────────────────────────────────────────
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const YEARS = [2025, 2026];

function ActivityCalendar({ gpt }) {
  const [selectedMonth, setSelectedMonth] = useState(4); // May
  const [selectedYear, setSelectedYear] = useState(2026);
  const [hoveredDay, setHoveredDay] = useState(null);

  // Sub-component for calendar info tooltip using smart positioning
  function CalendarInfoTooltip() {
    const tooltip = useSmartTooltip();
    return (
      <div className="relative" ref={tooltip.ref}>
        <button 
          onMouseEnter={tooltip.handleEnter}
          onMouseLeave={tooltip.handleLeave}
          className="text-[#555] hover:text-[#ececec] transition-colors shrink-0 flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#222]"
        >
          <Info size={12} />
        </button>
        {tooltip.showTooltip && (
          <SmartTooltip text="Heatmap of daily user chat sessions for the selected month, showing engagement patterns at a glance." position={tooltip.position} />
        )}
      </div>
    );
  }

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDayOfWeek = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const startDay = getStartDayOfWeek(selectedMonth, selectedYear);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(v => (v === 2026 ? 2025 : 2025));
    } else {
      setSelectedMonth(v => v - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(v => (v === 2025 ? 2026 : 2026));
    } else {
      setSelectedMonth(v => v + 1);
    }
  };

  const gridCells = [];
  for (let i = 0; i < startDay; i++) {
    gridCells.push({ empty: true, id: `empty-${i}` });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const seed = (day * 13 + (selectedMonth + 1) * 37 + selectedYear * 3) % 100;
    let sessions = 0;
    if (seed > 15) {
      sessions = Math.round(seed * 4.5 + 20);
    }
    
    let colorClass = 'bg-[#1b1b1f] hover:bg-[#2d2d30]';
    let level = 0;
    if (sessions > 0 && sessions <= 100) {
      colorClass = 'bg-[#0e4429] hover:bg-[#135a37]';
      level = 1;
    } else if (sessions > 100 && sessions <= 220) {
      colorClass = 'bg-[#006d32] hover:bg-[#008f41]';
      level = 2;
    } else if (sessions > 220 && sessions <= 350) {
      colorClass = 'bg-[#26a641] hover:bg-[#34c452]';
      level = 3;
    } else if (sessions > 350) {
      colorClass = 'bg-[#39d353] hover:bg-[#52e06b]';
      level = 4;
    }

    gridCells.push({
      empty: false,
      day,
      sessions,
      colorClass,
      level,
      id: `day-${day}`
    });
  }

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 border-b border-[#1f1f1f] gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-[#ffffff] tracking-tight">Active Days Grid</h3>
            <CalendarInfoTooltip />
          </div>
          <p className="text-[11px] text-[#a1a1aa] mt-0.5 font-medium">Sessions per day for the selected month</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevMonth}
            className="w-7 h-7 flex items-center justify-center bg-[#1c1c1e] border border-[#2d2d30] hover:border-[#3a3a3c] hover:text-[#ffffff] rounded text-[#8e8ea0] transition-colors"
          >
            &lt;
          </button>

          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="bg-[#1c1c1e] border border-[#2d2d30] rounded px-2.5 py-1 text-xs text-[#ffffff] font-medium outline-none cursor-pointer focus:border-[#3a3a3c]"
          >
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>

          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-[#1c1c1e] border border-[#2d2d30] rounded px-2.5 py-1 text-xs text-[#ffffff] font-medium outline-none cursor-pointer focus:border-[#3a3a3c]"
          >
            {YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button 
            onClick={handleNextMonth}
            className="w-7 h-7 flex items-center justify-center bg-[#1c1c1e] border border-[#2d2d30] hover:border-[#3a3a3c] hover:text-[#ffffff] rounded text-[#8e8ea0] transition-colors"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col items-center">
        <div className="w-full overflow-x-auto pb-2 flex justify-start sm:justify-center">
          <div className="min-w-[280px]">
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={i} className="text-[10px] text-[#555] font-semibold uppercase">{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 relative" style={{ overflow: 'visible' }}>
              {gridCells.map((cell, cellIndex) => {
                if (cell.empty) {
                  return <div key={cell.id} className="w-7 h-7 rounded-sm bg-transparent" />;
                }

                const isHovered = hoveredDay === cell.day;
                // Determine row position to fix tooltip clipping for first rows
                const cellPosition = cellIndex;
                const row = Math.floor(cellPosition / 7);
                const showBelow = row < 2; // First 2 rows: show tooltip below

                return (
                  <div
                    key={cell.id}
                    onMouseEnter={() => setHoveredDay(cell.day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={clsx(
                      "w-7 h-7 rounded-md transition-all duration-150 cursor-pointer relative flex items-center justify-center text-[10px] font-semibold select-none shadow-sm",
                      cell.colorClass,
                      cell.level > 1 ? "text-[#ffffff]" : "text-[#a1a1aa]"
                    )}
                  >
                    {cell.day}

                    {isHovered && (
                      <div className={clsx(
                        "absolute left-1/2 -translate-x-1/2 bg-[#1c1c1e] border border-[#3a3a3c] rounded px-2.5 py-1.5 text-[10px] text-[#ffffff] font-semibold shadow-2xl z-[9999] whitespace-nowrap text-center animate-in fade-in zoom-in-95 duration-100",
                        showBelow ? 'top-full mt-2' : 'bottom-full mb-2'
                      )}>
                        <p>{MONTHS[selectedMonth]} {cell.day}, {selectedYear}</p>
                        <p className="text-[#19c37d] mt-0.5">{cell.sessions.toLocaleString()} sessions</p>
                        <div className={clsx(
                          'absolute left-1/2 -translate-x-1/2 border-4 border-transparent',
                          showBelow ? 'bottom-full border-b-[#1c1c1e]' : 'top-full border-t-[#1c1c1e]'
                        )} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 self-end text-[10px] text-[#a1a1aa] mr-2">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-[#1b1b1f] border border-[#242426]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#0e4429]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#006d32]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#26a641]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#39d353]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// ─── TIME OF DAY ACTIVITY ────────────────────────────────────────────────────
const getTimeOfDayData = (hourlyHeatmap) => {
  if (!hourlyHeatmap) return [];
  return hourlyHeatmap.map(row => {
    const total = (row.sun || 0) + (row.mon || 0) + (row.tue || 0) + (row.wed || 0) + (row.thu || 0) + (row.fri || 0) + (row.sat || 0);
    return {
      time: row.hour,
      sessions: total
    };
  });
};

function TimeOfDayChart({ heatmapData }) {
  const chartData = getTimeOfDayData(heatmapData);

  return (
    <Card 
      title="Time-of-Day Activity" 
      subtitle="Peak usage hours"
      info="Shows when users are most active throughout the day."
    >
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="gtod" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#151515" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#8e8ea0' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#8e8ea0' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CT />} />
          <Area 
            type="monotone" 
            dataKey="sessions" 
            name="Sessions" 
            stroke="#8b5cf6" 
            strokeWidth={2.5} 
            fill="url(#gtod)" 
            dot={true} 
            activeDot={{ r: 5, fill: '#8b5cf6' }} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── OVERVIEW TAB ────────────────────────────────────────────────────────────
function OverviewTab({ data, selectedPeriod }) {
  const [graphPeriod, setGraphPeriod] = useState(selectedPeriod);
  const [graphView, setGraphView] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [growthPeriod, setGrowthPeriod] = useState('7w');
  const [growthView, setGrowthView] = useState('weekly');
  const [growthStartDate, setGrowthStartDate] = useState(new Date(2026, 4, 1));
  const [growthEndDate, setGrowthEndDate] = useState(new Date(2026, 4, 24));

  React.useEffect(() => {
    setGraphPeriod(selectedPeriod);
    if (selectedPeriod === '7w') setGraphView('weekly');
    else if (selectedPeriod === 'all') setGraphView('monthly');
    else setGraphView('daily');
  }, [selectedPeriod]);

  const dynamicDailyChats = getDailyChatsForPeriod(graphPeriod);

  // Dynamic growth data generator based on period
  const getGrowthData = () => {
    if (growthView === 'daily') {
      const days = growthPeriod === '1d' ? 1 : growthPeriod === '7d' ? 7 : growthPeriod === '30d' ? 30 : growthPeriod === '7w' ? 49 : 180;
      const count = Math.min(days, 8);
      const step = Math.max(1, Math.floor(days / count));
      return Array.from({ length: count }, (_, i) => {
        const dayNum = i * step + 1;
        const seed = (dayNum * 17 + 41) % 100;
        return { name: `Day ${dayNum}`, growth: Math.round(8 + seed * 0.35 - 5 + Math.sin(i) * 8) };
      });
    } else if (growthView === 'weekly') {
      const weeks = growthPeriod === '7d' ? 1 : growthPeriod === '30d' ? 4 : growthPeriod === '7w' ? 7 : growthPeriod === 'all' ? 8 : 2;
      return Array.from({ length: Math.max(weeks, 2) }, (_, i) => {
        const seed = ((i + 1) * 23 + 7) % 50;
        return { name: `W${i + 1}`, growth: Math.round(10 + seed * 0.6 + i * 2.5) };
      });
    } else {
      const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const count = growthPeriod === '30d' ? 2 : growthPeriod === '7w' ? 3 : growthPeriod === 'all' ? 6 : 4;
      return months.slice(0, count).map((m, i) => ({
        name: m,
        growth: Math.round(12 + i * 5.5 + Math.sin(i * 1.2) * 6)
      }));
    }
  };

  const growthData = getGrowthData();

  return (
    <div className="space-y-4">
      {/* Daily chats */}
      <Card
        title="Daily Active Chats"
        info="Tracks daily session volume and active unique users to understand usage trends."
        subtitle="Chats and users over time"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden sm:flex items-center gap-2.5 text-[9px] text-[#a1a1aa] font-bold uppercase tracking-wider mr-2">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#19c37d]" />Chats</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />Users</span>
            </div>
            
            <select
              value={graphView}
              onChange={(e) => {
                const val = e.target.value;
                setGraphView(val);
                if (val === 'weekly') setGraphPeriod('7w');
                else if (val === 'monthly') setGraphPeriod('all');
                else setGraphPeriod('30d');
              }}
              className="bg-[#1c1c1e] border border-[#2d2d30] hover:border-[#3a3a3c] rounded px-2.5 py-1 text-xs text-[#ffffff] font-medium outline-none cursor-pointer focus:border-[#3a3a3c] shadow-sm"
            >
              <option value="daily">Daily View</option>
              <option value="weekly">Weekly View</option>
              <option value="monthly">Monthly View</option>
            </select>

            <select
              value={graphPeriod}
              onChange={(e) => {
                const val = e.target.value;
                setGraphPeriod(val);
                if (val === '7w') setGraphView('weekly');
                else if (val === 'all') setGraphView('monthly');
                else setGraphView('daily');
              }}
              className="bg-[#1c1c1e] border border-[#2d2d30] hover:border-[#3a3a3c] rounded px-2.5 py-1 text-xs text-[#ffffff] font-medium outline-none cursor-pointer focus:border-[#3a3a3c] shadow-sm"
            >
              <option value="1d">1 Day</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="7w">7 Weeks</option>
              <option value="1m">1 Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={dynamicDailyChats} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#19c37d" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#19c37d" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="gu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CT />} />
            <Area type="monotone" dataKey="chats" name="Chats" stroke="#19c37d" strokeWidth={2} fill="url(#gc)" dot={false} activeDot={{ r: 4, fill: '#19c37d' }} />
            <Area type="monotone" dataKey="users" name="Users" stroke="#6366f1" strokeWidth={2} fill="url(#gu)" dot={false} activeDot={{ r: 4, fill: '#6366f1' }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Growth % + token stats side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card 
          title="Growth %" 
          info="Volume change percentage over the selected period, split into equal segments."
          subtitle={`${growthView.charAt(0).toUpperCase() + growthView.slice(1)} trend`}
          action={
            <div className="flex items-center gap-1.5">
              <select
                value={growthView}
                onChange={(e) => setGrowthView(e.target.value)}
                className="bg-[#1c1c1e] border border-[#2d2d30] hover:border-[#3a3a3c] rounded px-2 py-1 text-xs text-[#ffffff] font-medium outline-none cursor-pointer focus:border-[#3a3a3c] shadow-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <CustomCalendarPicker 
                selectedPeriod={growthPeriod} 
                onChange={setGrowthPeriod} 
                startDate={growthStartDate} 
                endDate={growthEndDate} 
                setStartDate={setGrowthStartDate} 
                setEndDate={setGrowthEndDate} 
              />
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={growthData} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CT />} formatter={v => [`${v}%`, 'Growth']} />
              <Bar dataKey="growth" name="Growth %" fill="#19c37d" radius={[3, 3, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Token & Prompt Stats" info="Average input/output tokens, prompt length, and conversation frequency per user." subtitle="Per-session averages">
          <div className="grid grid-cols-2 gap-3.5">
            {[
              { label: 'Avg Prompt Length', value: `${data.tokenStats.avgPromptLength} words`,  accent: '#19c37d' },
              { label: 'Avg Input Tokens',  value: data.tokenStats.avgInputTokens,               accent: '#6366f1' },
              { label: 'Avg Output Tokens', value: data.tokenStats.avgOutputTokens,              accent: '#f59e0b' },
              { label: 'Convos / User',     value: `${data.tokenStats.avgConvosPerUser}x`,       accent: '#8b5cf6' },
            ].map(({ label, value, accent }) => (
              <div key={label} className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 hover:border-[#383838] transition-colors">
                <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wider font-semibold mb-1.5">{label}</p>
                <p className="text-lg font-bold" style={{ color: accent }}>{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Drop-off curve + Quality side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card title="User Drop-off Curve" info="Shows how many users continue conversations at each message depth." subtitle="Retention by message depth">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data.dropOffCurve} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="gdrop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" vertical={false} />
              <XAxis dataKey="convo" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} label={{ value: 'Convo #', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#a1a1aa' }} />
              <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CT />} formatter={v => [`${v}%`, 'Active users']} />
              <Area type="monotone" dataKey="pct" name="Active users" stroke="#ef4444" strokeWidth={2} fill="url(#gdrop)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center gap-4 text-[11px] text-[#a1a1aa]">
            <span>25% exit after <b className="text-[#ffffff]">1</b> convo</span>
            <span>50% exit after <b className="text-[#ffffff]">3</b></span>
            <span>75% after <b className="text-[#ffffff]">6</b></span>
          </div>
        </Card>

        <Card title="Conversation Quality" info="Key quality signals including exchange depth, regeneration triggers, and session duration." subtitle="Quality metrics">
          <div className="grid grid-cols-2 gap-3.5">
            {[
              { label: 'Avg Conv. Depth',   value: `${data.conversationQuality.avgDepth} msgs`, accent: '#19c37d',  icon: MessageSquare },
              { label: 'Regen Rate',         value: `${data.conversationQuality.regenerationRate}%`,       accent: '#f59e0b',  icon: RotateCcw     },
              { label: 'Drop-off After 1st', value: `${data.conversationQuality.dropOffAfterFirst}%`,      accent: '#ef4444',  icon: AlertCircle   },
              { label: 'Long Sessions >5m',  value: `${data.conversationQuality.longSessionPct}%`,         accent: '#8b5cf6',  icon: Clock         },
            ].map(({ label, value, accent, icon: Icon }) => (
              <div key={label} className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 hover:border-[#383838] transition-colors">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon size={12} style={{ color: accent }} />
                  <span className="text-[10px] text-[#a1a1aa] uppercase tracking-wider font-semibold">{label}</span>
                </div>
                <p className="text-lg font-bold text-[#ffffff]">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Compact Side-by-side Grid Calendar & Time of Day Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActivityCalendar gpt={data} />
        <TimeOfDayChart heatmapData={data.hourlyHeatmap} />
      </div>
    </div>
  );
}

// ─── MODELS TAB ──────────────────────────────────────────────────────────────
function ModelsTab({ data }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Donut + bars */}
        <Card title="Model Distribution" info="Share of sessions processed by each model version." subtitle="Sessions by model">
          <div className="flex items-center gap-6">
            <div className="w-36 h-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.modelUsage} cx="50%" cy="50%" innerRadius={40} outerRadius={62} dataKey="usage" nameKey="model" paddingAngle={3}>
                    {data.modelUsage.map((e, i) => <Cell key={i} fill={e.color} opacity={0.85} />)}
                  </Pie>
                  <Tooltip content={<CT />} formatter={v => [`${v}%`, 'Usage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {data.modelUsage.map(m => (
                <div key={m.model}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[#e4e4e7]">{m.model}</span>
                    <span className="text-sm font-bold" style={{ color: m.color }}>{m.usage}%</span>
                  </div>
                  <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${m.usage}%`, backgroundColor: m.color, opacity: 0.75 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Model switching */}
        <Card title="Model Switching Frequency" info="How often users switch between models during a session." subtitle="Mid-session switch rates">
          <div className="space-y-3">
            {data.modelUsage.map(m => (
              <div key={m.model} className="flex items-center justify-between p-3.5 bg-[#1c1c1e] rounded-xl border border-[#2c2c2f]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-sm text-[#e4e4e7] font-medium">{m.model}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: m.color }}>{(m.switchFreq * 100).toFixed(0)}%</p>
                  <p className="text-[10px] text-[#a1a1aa] mt-0.5 font-medium">switch rate</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Comparative metrics */}
      <Card title="Session Depth by Model" info="Comparative metrics showing conversation depth and token usage per model." subtitle="Per-model comparison">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                {['Model', 'Avg Conv. Depth', 'Avg Tokens/Session', 'Switch Frequency', 'Share'].map(h => (
                  <th key={h} className="text-left py-2.5 pr-6 text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.modelUsage.map(m => (
                <tr key={m.model} className="border-b border-[#161619] hover:bg-[#1c1c1e] transition-colors">
                  <td className="py-3 pr-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="text-[#e4e4e7] font-semibold">{m.model}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-6 text-[#e4e4e7] font-medium">{m.avgDepth} msgs</td>
                  <td className="py-3 pr-6 text-[#e4e4e7] font-medium">{m.avgTokens.toLocaleString()}</td>
                  <td className="py-3 pr-6">
                    <span className="text-[#a1a1aa] font-medium">{(m.switchFreq * 100).toFixed(0)}%</span>
                  </td>
                  <td className="py-3 pr-6">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${m.usage}%`, backgroundColor: m.color, opacity: 0.7 }} />
                      </div>
                      <span className="text-[#a1a1aa] text-xs font-semibold">{m.usage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── TOOLS TAB ───────────────────────────────────────────────────────────────
const TOOL_ICONS = {
  'Web Search':       Search,
  'Canvas':           PenLine,
  'Image Generation': ImageIcon,
  'Code Interpreter': Code,
  'Voice Mode':       Volume2,
  'File Upload':      Upload,
};

function ToolsTab({ data }) {
  return (
    <div className="space-y-4">
      {/* Insight callout — top */}
      <div className="p-4 rounded-xl bg-[#19c37d]/5 border border-[#19c37d]/15">
        <p className="text-xs text-[#a1a1aa] leading-relaxed font-medium">
          <span className="text-[#19c37d] font-bold">Key insights: </span>
          Users who invoked <b className="text-[#e4e4e7]">Canvas</b> stayed 2.8× longer on average.
          <b className="text-[#e4e4e7]"> Code Interpreter</b> sessions have the highest retention (81%) and lowest drop-off (5%).
          <b className="text-[#e4e4e7]"> Image Generation</b> has the highest latency (3.2s) — consider a loading indicator.
        </p>
      </div>

      {/* Usage overview */}
      <Card title="Tool Usage Overview" info="Usage counts, session shares, retention impact, and latency for each built-in tool." subtitle="Performance per tool">
        <div className="space-y-3">
          {data.toolUsage.map(tool => {
            const Icon = TOOL_ICONS[tool.tool] || Zap;
            return (
              <div key={tool.tool} className="p-4 bg-[#1c1c1e] rounded-xl border border-[#2c2c2f] hover:border-[#3a3a3c] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#262629] flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-[#a1a1aa]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-[#e4e4e7]">{tool.tool}</span>
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <span className="text-[#a1a1aa]">{tool.count.toLocaleString()} uses</span>
                        <span className="font-bold text-[#e4e4e7]">{tool.pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden mb-2.5">
                      <div className="h-full rounded-full bg-[#19c37d]" style={{ width: `${tool.pct}%`, opacity: 0.55 + tool.pct / 200 }} />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Avg session after', value: tool.avgSessionAfter },
                        { label: 'Retention after',   value: `${tool.retentionAfter}%`, good: true },
                        { label: 'Drop-off after',    value: `${tool.dropOffAfter}%`,  bad: true  },
                        { label: 'Avg latency',       value: tool.avgLatency },
                      ].map(({ label, value, good, bad }) => (
                        <div key={label} className="text-center">
                          <p className={clsx('text-xs font-bold', good ? 'text-[#19c37d]' : bad ? 'text-red-400' : 'text-[#e4e4e7]')}>{value}</p>
                          <p className="text-[10px] text-[#a1a1aa] mt-0.5 font-medium">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tool usage timeline */}
      <Card
        title="Tool Invocation Timeline"
        info="Daily invocation volumes for all built-in tools."
        subtitle="Daily tool usage timeline"
        action={
          <div className="flex items-center gap-3 text-[11px]">
            {[
              { label: 'Web Search', color: '#19c37d' },
              { label: 'Canvas',     color: '#6366f1' },
              { label: 'Image',      color: '#f59e0b' },
              { label: 'Code',       color: '#ec4899' },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5 text-[#a1a1aa] font-semibold">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </span>
            ))}
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data.toolTimeline} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
            <defs>
              {[
                { id: 'tws', color: '#19c37d' },
                { id: 'tc',  color: '#6366f1' },
                { id: 'ti',  color: '#f59e0b' },
                { id: 'tco', color: '#ec4899' },
              ].map(({ id, color }) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={color} stopOpacity={0}    />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#151515" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CT />} />
            <Area type="monotone" dataKey="webSearch" name="Web Search" stroke="#19c37d" strokeWidth={1.5} fill="url(#tws)" dot={false} />
            <Area type="monotone" dataKey="canvas"    name="Canvas"     stroke="#6366f1" strokeWidth={1.5} fill="url(#tc)"  dot={false} />
            <Area type="monotone" dataKey="image"     name="Image"      stroke="#f59e0b" strokeWidth={1.5} fill="url(#ti)"  dot={false} />
            <Area type="monotone" dataKey="code"      name="Code"       stroke="#ec4899" strokeWidth={1.5} fill="url(#tco)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ─── KNOWLEDGE TAB ────────────────────────────────────────────────────────────
function KnowledgeTab({ data }) {
  const [retrievalView, setRetrievalView] = useState('30d');
  const maxR = data.knowledgeFiles[0].retrievals;
  return (
    <div className="space-y-4">
      {/* Insight callout — top */}
      <div className="p-4 rounded-xl bg-[#6366f1]/5 border border-[#6366f1]/15">
        <p className="text-xs text-[#a1a1aa] leading-relaxed font-medium">
          <span className="text-[#6366f1] font-bold">Knowledge insight: </span>
          <b className="text-[#e4e4e7]">tone_examples.pdf</b> contributes to 48% of retrievals and has the highest session continuation (88%).
          <b className="text-[#e4e4e7]"> slang_dictionary.pdf</b> has a 33% abandonment rate — consider revising or expanding its content.
        </p>
      </div>

      <Card title="Knowledge File Performance" info="Retrieval rates, success metrics, latency, and contribution per uploaded file." subtitle="Per-file performance">
        <div className="space-y-3">
          {data.knowledgeFiles.map((file, i) => (
            <div key={file.name} className="p-4 bg-[#1c1c1e] rounded-xl border border-[#2c2c2f] hover:border-[#3a3a3c] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#262629] flex items-center justify-center shrink-0">
                    <FileText size={13} className="text-[#a1a1aa]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#e4e4e7]">{file.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-[#a1a1aa] font-medium">{file.retrievals.toLocaleString()} retrievals</span>
                      <span className="text-[11px] text-[#333]">·</span>
                      <span className={clsx('flex items-center gap-1 text-[11px] font-semibold', file.successRate >= 95 ? 'text-[#19c37d]' : 'text-[#f59e0b]')}>
                        <CheckCircle2 size={10} />
                        {file.successRate}% success
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-[#a1a1aa] bg-[#262629] border border-[#2c2c2f] px-2 py-0.5 rounded font-bold shrink-0">#{i + 1}</span>
              </div>
              {/* Retrieval bar */}
              <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full bg-[#19c37d]" style={{ width: `${(file.retrievals / maxR) * 100}%`, opacity: 0.65 }} />
              </div>
              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Contribution', value: `${file.contributionPct}%`,  color: '#19c37d' },
                  { label: 'Sessions cont.', value: `${file.sessionsAfter}%`,  color: '#6366f1' },
                  { label: 'Sessions abnd.', value: `${file.abandoned}%`,      color: '#ef4444' },
                  { label: 'Avg latency',  value: file.avgLatency,             color: '#f59e0b' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-[#141414] border border-[#262626] rounded-xl py-2 shadow-sm">
                    <p className="text-xs font-bold" style={{ color }}>{value}</p>
                    <p className="text-[10px] text-[#a1a1aa] mt-0.5 font-semibold">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Knowledge usage over time */}
      <Card 
        title="Retrieval Volume Over Time" 
        info="Volume of knowledge base retrievals from conversation prompts." 
        subtitle="Retrieval volume"
        action={
          <select
            value={retrievalView}
            onChange={(e) => setRetrievalView(e.target.value)}
            className="bg-[#1c1c1e] border border-[#2d2d30] hover:border-[#3a3a3c] rounded px-2.5 py-1 text-xs text-[#ffffff] font-medium outline-none cursor-pointer focus:border-[#3a3a3c] shadow-sm"
          >
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="all">All Time</option>
          </select>
        }
      >
        <ResponsiveContainer width="100%" height={180}>
          <BarChart 
            data={
              retrievalView === '7d' 
                ? data.dailyChats.slice(-7).map(d => ({ ...d, retrievals: Math.floor(d.chats * 0.46) }))
                : retrievalView === 'all'
                ? [{ date: 'Dec', retrievals: 1930 }, { date: 'Jan', retrievals: 2668 }, { date: 'Feb', retrievals: 3312 }, { date: 'Mar', retrievals: 4094 }, { date: 'Apr', retrievals: 5152 }, { date: 'May', retrievals: 6762 }]
                : data.dailyChats.map(d => ({ ...d, retrievals: Math.floor(d.chats * 0.46) }))
            } 
            margin={{ top: 5, right: 5, left: -18, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CT />} />
            <Bar dataKey="retrievals" name="Retrievals" fill="#6366f1" radius={[3, 3, 0, 0]} opacity={0.65} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ─── RETENTION TAB ────────────────────────────────────────────────────────────
function RetentionTab({ data }) {
  const [returnView, setReturnView] = useState('weekly');
  return (
    <div className="space-y-4">
      {/* Funnel */}
      <Card title="Conversion Funnel" info="User journey from landing on the GPT page through sending prompts to returning within 7 days." subtitle="User journey conversion">
        <div className="space-y-2.5">
          {data.funnel.map((step, i) => (
            <div key={step.stage}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#262629] border border-[#2c2c2f] flex items-center justify-center text-[10px] text-[#a1a1aa] font-bold shrink-0">{i + 1}</span>
                  <span className="text-sm font-semibold text-[#e4e4e7]">{step.stage}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#a1a1aa] font-medium">{step.count.toLocaleString()}</span>
                  <span className="text-sm font-bold text-[#e4e4e7] w-12 text-right">{step.pct}%</span>
                </div>
              </div>
              <div className="h-2 bg-[#141414] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${step.pct}%`, background: `rgba(25,195,125,${0.9 - i * 0.13})` }}
                />
              </div>
              {i < data.funnel.length - 1 && (
                <p className="text-[10px] text-[#a1a1aa] text-right mt-0.5 font-semibold">
                  ↓ {((data.funnel[i + 1].pct / step.pct) * 100).toFixed(0)}% proceed
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Starter prompt performance */}
      <Card title="Conversation Starter Performance" info="Click-through rates, conversation depths, and drop-off rates for your configured starters." subtitle="Per-starter metrics">
        <div className="space-y-2.5">
          {data.starterPrompts.map((sp, i) => (
            <div key={sp.prompt} className="p-3.5 bg-[#1c1c1e] rounded-xl border border-[#2c2c2f] hover:border-[#3a3a3c] transition-colors">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-[#e4e4e7] font-bold max-w-xs">"{sp.prompt}"</p>
                <div className="flex items-center gap-1 ml-4 shrink-0">
                  {i === 0 && <span className="text-[10px] text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-1.5 py-0.5 rounded-full font-bold">Top</span>}
                  {sp.dropOff >= 30 && <span className="text-[10px] text-red-400 bg-red-400/10 border border-red-400/20 px-1.5 py-0.5 rounded-full font-bold">High drop-off</span>}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Sessions',   value: sp.sessions.toLocaleString(), color: '#ececec' },
                  { label: 'CTR',        value: `${sp.ctr}%`,    color: '#19c37d'  },
                  { label: 'Avg depth',  value: `${sp.avgDepth}`, color: '#6366f1' },
                  { label: 'Drop-off',   value: `${sp.dropOff}%`, color: sp.dropOff >= 30 ? '#ef4444' : '#8e8ea0' },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <p className="text-xs font-bold" style={{ color }}>{value}</p>
                    <p className="text-[10px] text-[#a1a1aa] mt-0.5 font-semibold">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Cohort heatmap */}
      <Card title="Cohort Retention Heatmap" info="Returning user percentages on Day 1, 7, 14, and 30 after first session." subtitle="Weekly cohort retention">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                {['Cohort', 'Day 1', 'Day 7', 'Day 14', 'Day 30'].map(h => (
                  <th key={h} className={clsx('py-2.5 text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider', h === 'Cohort' ? 'text-left pr-4' : 'text-center px-3')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.retentionCohorts.map(row => (
                <tr key={row.cohort} className="border-b border-[#141416]">
                  <td className="py-3 pr-4 text-[#e4e4e7] font-bold">{row.cohort}</td>
                  {['d1', 'd7', 'd14', 'd30'].map(d => {
                    const val = row[d];
                    const intensity = val / 55;
                    return (
                      <td key={d} className="py-3 px-3 text-center">
                        <span
                          className="inline-block px-2.5 py-1 rounded-md text-xs font-bold"
                          style={{
                            backgroundColor: `rgba(25,195,125,${intensity * 0.45})`,
                            color: val > 30 ? '#19c37d' : val > 15 ? '#7dd3b4' : '#666'
                          }}
                        >
                          {val}%
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Returning users by week */}
      <Card 
        title={returnView === 'weekly' ? "Returning Users — Weekly" : "Returning Users — Monthly"} 
        info="Trend of users who returned within 7 days of their first session." 
        subtitle={returnView === 'weekly' ? "Weekly return rate" : "Monthly return rate"}
        action={
          <select
            value={returnView}
            onChange={(e) => setReturnView(e.target.value)}
            className="bg-[#1c1c1e] border border-[#2d2d30] hover:border-[#3a3a3c] rounded px-2.5 py-1 text-xs text-[#ffffff] font-medium outline-none cursor-pointer focus:border-[#3a3a3c] shadow-sm"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        }
      >
        <ResponsiveContainer width="100%" height={180}>
          <LineChart 
            data={returnView === 'weekly' 
              ? data.returningByWeek 
              : [
                  { week: 'Dec', returning: 24 },
                  { week: 'Jan', returning: 28 },
                  { week: 'Feb', returning: 31 },
                  { week: 'Mar', returning: 35 },
                  { week: 'Apr', returning: 38 },
                  { week: 'May', returning: 42 },
                ]
            } 
            margin={{ top: 5, right: 5, left: -18, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip content={<CT />} formatter={v => [`${v}%`, 'Returning users']} />
            <Line type="monotone" dataKey="returning" name="Returning %" stroke="#19c37d" strokeWidth={2.5} dot={{ fill: '#19c37d', r: 4, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ─── SAFETY & PERFORMANCE TAB ────────────────────────────────────────────────
function SafetyTab({ data }) {
  const s = data.safety || analyticsData['g-6a0f3e130afc8191851f1fcbd820b918-sallutweets'].safety;
  return (
    <div className="space-y-4">
      {/* Insight callout — top */}
      <div className="p-4 rounded-xl bg-[#ef4444]/5 border border-[#ef4444]/12">
        <p className="text-xs text-[#a1a1aa] leading-relaxed font-medium">
          <span className="text-red-400 font-bold">Safety note: </span>
          Refusal rate (4.2%) is within normal range for a public creative GPT.
          Hallucination suspicion spikes correlate with <b className="text-[#e4e4e7]">Web Search</b> tool usage — consider adding citation prompting to your system instructions.
        </p>
      </div>

      {/* Safety KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <KPI 
          label="Refusal Rate" 
          value={`${s.refusalRate}%`} 
          icon={Shield} 
          accent="#ef4444" 
          definition="The percentage of user queries that triggered a safety policy block or refusal response from the model."
        />
        <KPI 
          label="Sensitive Topics" 
          value={`${s.sensitiveTopicRate}%`} 
          icon={AlertCircle} 
          accent="#f59e0b" 
          definition="Percentage of queries containing keywords matching monitored policy topics (e.g., explicit materials, violence)."
        />
        <KPI 
          label="Hallucination Suspicion" 
          value={`${s.hallucinationSuspicion}%`} 
          icon={Eye} 
          accent="#8b5cf6" 
          definition="Heuristically detected occurrences of potential source mismatch or logically inconsistent statements."
        />
        <KPI 
          label="Unable to Help" 
          value={`${s.unableToHelpRate}%`} 
          icon={TrendingDown} 
          accent="#6366f1" 
          definition="The rate at which the model responds that it cannot perform the requested action or fetch the information."
        />
      </div>

      {/* Refusals over time */}
      <Card
        title="Policy Events Over Time"
        info="Daily policy refusal and sensitive content detection rates."
        subtitle="Daily safety events"
        action={
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#a1a1aa] font-semibold"><span className="w-2 h-2 rounded-full bg-red-400" />Refusals</span>
            <span className="flex items-center gap-1.5 text-[#a1a1aa] font-semibold"><span className="w-2 h-2 rounded-full bg-[#f59e0b]" />Sensitive</span>
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={s.refusalsByDay} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#151515" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CT />} />
            <Area type="monotone" dataKey="refusals"  name="Refusals"         stroke="#ef4444" strokeWidth={2} fill="url(#gr)" dot={false} />
            <Area type="monotone" dataKey="sensitive" name="Sensitive topics" stroke="#f59e0b" strokeWidth={2} fill="url(#gs)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Refusal categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card title="Refusal Categories" info="Top reasons for policy-triggered refusals." subtitle="Refusals by category">
          <div className="space-y-3.5">
            {s.topRefusalCategories.map(cat => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#e4e4e7] font-semibold">{cat.category}</span>
                  <span className="text-xs font-bold text-[#e4e4e7]">{cat.pct}%</span>
                </div>
                <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-red-400" style={{ width: `${cat.pct}%`, opacity: 0.6 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Latency & Performance" info="Response time, tool delays, and retrieval latency metrics." subtitle="System response times">
          <div className="space-y-3.5">
            {[
              { label: 'Avg Response Time',    value: `${s.latency.avgResponseTime}s`,    accent: '#19c37d' },
              { label: 'Avg Tool Delay',        value: `${s.latency.avgToolDelay}s`,        accent: '#f59e0b' },
              { label: 'Avg Retrieval Latency', value: `${s.latency.avgRetrievalLatency}s`, accent: '#6366f1' },
              { label: 'P95 Response Time',     value: `${s.latency.p95ResponseTime}s`,     accent: '#ef4444' },
            ].map(({ label, value, accent }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#1f1f1f]">
                <span className="text-xs text-[#a1a1aa] font-semibold">{label}</span>
                <span className="text-xs font-bold" style={{ color: accent }}>{value}</span>
              </div>
            ))}
            <div className="mt-2.5">
              <p className="text-[10px] text-[#a1a1aa] mb-2 uppercase tracking-wider font-bold">Slowest Workflows</p>
              {s.latency.slowestWorkflows.map(w => (
                <div key={w.workflow} className="flex items-center justify-between py-1 border-b border-[#1f1f1f]/30">
                  <span className="text-xs text-[#a1a1aa] truncate max-w-[160px] font-medium">{w.workflow}</span>
                  <span className="text-xs text-[#f59e0b] font-semibold">{(w.avgMs / 1000).toFixed(1)}s</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
// ─── BOOKING-STYLE CUSTOM RANGE CALENDAR FILTER ──────────────────────────────
function CustomCalendarPicker({ selectedPeriod, onChange, startDate, endDate, setStartDate, setEndDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(4); // May
  const [currentYear, setCurrentYear] = useState(2026);
  const [hoveredDate, setHoveredDate] = useState(null);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getStartDayOfWeek = (month, year) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startDay = getStartDayOfWeek(currentMonth, currentYear);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleDayClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
        onChange('custom');
      }
    }
  };

  const presets = [
    { label: '1 Day',    val: '1d' },
    { label: '7 Days',   val: '7d' },
    { label: '30 Days',  val: '30d' },
    { label: '7 Weeks',  val: '7w' },
    { label: '1 Month',  val: '1m' },
    { label: 'All Time', val: 'all' },
  ];

  const handlePresetClick = (preset) => {
    onChange(preset);
    setIsOpen(false);
    const end = new Date(2026, 4, 24);
    let start = new Date(2026, 4, 24);
    if (preset === '1d') start.setDate(end.getDate() - 1);
    else if (preset === '7d') start.setDate(end.getDate() - 7);
    else if (preset === '30d') start.setDate(end.getDate() - 30);
    else if (preset === '7w') start.setDate(end.getDate() - 49);
    else if (preset === '1m') start.setMonth(end.getMonth() - 1);
    else if (preset === 'all') start = new Date(2025, 11, 1);
    
    setStartDate(start);
    setEndDate(end);
  };

  const cells = [];
  for (let i = 0; i < startDay; i++) {
    cells.push({ empty: true, id: `empty-${i}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(currentYear, currentMonth, d);
    cells.push({ empty: false, day: d, date: dateObj, id: `day-${d}` });
  }

  const formatDate = (d) => {
    if (!d) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const isSelected = (date) => {
    if (!date) return false;
    return (startDate && startDate.toDateString() === date.toDateString()) || 
           (endDate && endDate.toDateString() === date.toDateString());
  };

  const isInRange = (date) => {
    if (!date || !startDate) return false;
    if (endDate) {
      return date > startDate && date < endDate;
    }
    if (hoveredDate) {
      return date > startDate && date < hoveredDate;
    }
    return false;
  };

  const buttonText = selectedPeriod === 'custom' && startDate && endDate 
    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
    : selectedPeriod === '1d' ? '1 Day'
    : selectedPeriod === '7d' ? '7 Days'
    : selectedPeriod === '30d' ? '30 Days'
    : selectedPeriod === '7w' ? '7 Weeks'
    : selectedPeriod === '1m' ? '1 Month'
    : selectedPeriod === 'all' ? 'All Time'
    : 'Select dates';

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-[#262626] hover:border-[#19c37d]/40 rounded-lg text-xs text-[#ffffff] font-medium transition-all shadow-sm active:scale-[0.98]"
      >
        <Calendar size={12} className="text-[#a1a1aa]" />
        <span>{buttonText}</span>
        <ChevronDown size={11} className="text-[#a1a1aa] shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 p-4 bg-[#1c1c1e] border border-[#2d2d30] rounded-xl shadow-2xl z-50 flex gap-4 animate-in fade-in slide-in-from-top-2 duration-200 select-none min-w-[420px]">
            {/* Presets Sidebar */}
            <div className="w-28 flex flex-col gap-1 border-r border-[#2d2d30] pr-3 shrink-0">
              <span className="text-[9px] text-[#a1a1aa] font-bold uppercase tracking-wider mb-1 px-1">Presets</span>
              {presets.map(p => (
                <button
                  key={p.val}
                  onClick={() => handlePresetClick(p.val)}
                  className={clsx(
                    "w-full text-left px-2 py-1.5 rounded text-xs transition-colors font-medium",
                    selectedPeriod === p.val
                      ? "bg-[#19c37d]/10 text-[#19c37d] font-bold"
                      : "text-[#d4d4d8] hover:bg-[#262626] hover:text-[#ffffff]"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Interactive Month Grid */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-[#262626] text-[#a1a1aa] hover:text-white rounded transition-colors text-xs font-bold"
                >
                  &lt;
                </button>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button 
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-[#262626] text-[#a1a1aa] hover:text-white rounded transition-colors text-xs font-bold"
                >
                  &gt;
                </button>
              </div>

              <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => (
                  <span key={w} className="text-[9px] text-[#71717a] font-bold uppercase">{w}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {cells.map(cell => {
                  if (cell.empty) {
                    return <div key={cell.id} className="w-7 h-7" />;
                  }

                  const selected = isSelected(cell.date);
                  const range = isInRange(cell.date);

                  return (
                    <div
                      key={cell.id}
                      onClick={() => handleDayClick(cell.day)}
                      onMouseEnter={() => !endDate && setHoveredDate(cell.date)}
                      onMouseLeave={() => setHoveredDate(null)}
                      className={clsx(
                        "w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-semibold transition-all duration-100 cursor-pointer",
                        selected
                          ? "bg-[#19c37d] text-[#000] font-extrabold shadow-md scale-105"
                          : range
                          ? "bg-[#19c37d]/15 text-[#19c37d] hover:bg-[#19c37d]/25"
                          : "text-[#d4d4d8] hover:bg-[#262626]"
                      )}
                    >
                      {cell.day}
                    </div>
                  );
                })}
              </div>

              {/* Apply details footer */}
              <div className="mt-3.5 pt-3.5 border-t border-[#2d2d30] flex items-center justify-between gap-2">
                <div className="text-[10px] text-[#a1a1aa] font-medium">
                  {startDate && formatDate(startDate)} {endDate && `- ${formatDate(endDate)}`}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={!startDate || !endDate}
                  className={clsx(
                    "px-3 py-1 rounded text-xs font-bold transition-all shadow-sm active:scale-95",
                    startDate && endDate
                      ? "bg-[#19c37d] text-black hover:bg-[#17b371]"
                      : "bg-[#262626] text-[#71717a] cursor-not-allowed"
                  )}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AnalyticsDashboard({ gpt, onBack }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [promptSharing, setPromptSharing] = useState(false);
  const sharingTooltip = useSmartTooltip();
  const [startDate, setStartDate] = useState(new Date(2026, 4, 1)); // May 1, 2026
  const [endDate, setEndDate] = useState(new Date(2026, 4, 24)); // May 24, 2026
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  
  const data = analyticsData[gpt?.id] || analyticsData['sallu-tweets'];
  if (!data) return null;

  const activeKpis = getKpisForPeriod(data.kpis, selectedPeriod);

  return (
    <div className="flex-1 overflow-y-auto bg-[#212121]">
      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[#a1a1aa] hover:text-[#ffffff] transition-colors mb-5 group font-medium"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          My GPTs
        </button>

        {/* GPT header */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 shadow-lg border border-[#2d2d30] bg-[#141414] overflow-hidden"
              style={{ boxShadow: `0 8px 30px ${gpt.color}15` }}
            >
              {gpt.logo ? (
                <img src={gpt.logo} alt={`${gpt.name} logo`} className="w-full h-full object-cover" />
              ) : (
                gpt.emoji
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <a 
                  href={`https://chatgpt.com/g/${gpt.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-2xl font-extrabold text-white hover:text-[#19c37d] transition-all flex items-center gap-2 group cursor-pointer tracking-tight"
                >
                  {gpt.name}
                  <ExternalLink size={18} className="text-[#a1a1aa] group-hover:text-[#19c37d] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </a>
                <span className={clsx(
                  'flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold border tracking-wider uppercase',
                  gpt.visibility === 'public'
                    ? 'bg-[#19c37d]/10 text-[#19c37d] border-[#19c37d]/20'
                    : 'bg-[#8e8ea0]/10 text-[#a1a1aa] border-[#8e8ea0]/20'
                )}>
                  {gpt.visibility === 'public' ? <Globe size={9} /> : <Lock size={9} />}
                  {gpt.visibility === 'public' ? 'Public' : 'Private'}
                </span>
                <button
                  onClick={() => window.open('/', '_blank')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-[11px] font-bold rounded-lg shadow-sm transition-all active:scale-[0.97] shrink-0"
                >
                  <Sparkles size={11} />
                  Behind the Build Story
                </button>
              </div>
              <p className="text-sm text-[#d4d4d8] mt-1.5 max-w-xl leading-relaxed font-medium">{gpt.tagline}</p>
              <div className="flex flex-wrap items-center gap-2.5 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-[#ffffff] font-semibold bg-[#1b1b1f] border border-[#2d2d30] px-3 py-1 rounded-lg shadow-sm">
                  <Clock size={12} className="text-[#a1a1aa]" />
                  Updated {gpt.lastUpdated}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[#ffffff] font-semibold bg-[#1b1b1f] border border-[#2d2d30] px-3 py-1 rounded-lg shadow-sm">
                  <MessageSquare size={12} className="text-[#a1a1aa]" />
                  {activeKpis.totalChats.toLocaleString()} total chats
                </span>
              </div>
            </div>
          </div>

           <div className="flex flex-col items-end shrink-0 gap-2">
            <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
              <CustomCalendarPicker 
                selectedPeriod={selectedPeriod} 
                onChange={setSelectedPeriod} 
                startDate={startDate} 
                endDate={endDate} 
                setStartDate={setStartDate} 
                setEndDate={setEndDate} 
              />
              <button
                onClick={() => exportCSV(gpt, { ...data, kpis: activeKpis })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-[#262626] hover:border-[#19c37d]/40 rounded-lg text-xs text-[#a1a1aa] hover:text-[#19c37d] transition-colors font-medium shadow-sm"
              >
                <Download size={12} />
                Export CSV
              </button>
              <button
                onClick={() => {
                  if (!showAiInsights) {
                    setAiInsightsLoading(true);
                    setTimeout(() => {
                      setAiInsightsLoading(false);
                      setShowAiInsights(true);
                    }, 1200);
                  } else {
                    setShowAiInsights(false);
                  }
                }}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-[0.97]",
                  showAiInsights
                    ? "bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-[#8b5cf6]"
                    : "bg-gradient-to-r from-[#8b5cf6]/20 to-[#ec4899]/20 border border-[#8b5cf6]/25 text-[#d4d4d8] hover:text-white hover:border-[#8b5cf6]/50"
                )}
              >
                {aiInsightsLoading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-[#8b5cf6]/30 border-t-[#8b5cf6] rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : showAiInsights ? (
                  <>
                    <X size={12} />
                    Hide Insights
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    AI Insights
                  </>
                )}
              </button>
            </div>
            
            {/* Anonymous Prompt Sharing Toggle Switch with Hover Help popover */}
            <div className="flex items-center gap-2 bg-[#141414] border border-[#262626] rounded-lg px-2.5 py-1 shadow-sm select-none relative">
              <span className="text-[10px] text-[#a1a1aa] font-bold uppercase tracking-wider">Share prompts by default</span>
              <div className="relative shrink-0" ref={sharingTooltip.ref}>
                <button
                  onMouseEnter={sharingTooltip.handleEnter}
                  onMouseLeave={sharingTooltip.handleLeave}
                  className="text-[#525252] hover:text-[#e4e4e7] transition-colors shrink-0 flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-[#262626]"
                >
                  <Info size={11} />
                </button>
                {sharingTooltip.showTooltip && (
                  <SmartTooltip text="When enabled, conversations are anonymously shared by default. Users are visually notified in their chat pane that their prompts are shared for analytics optimization." position={sharingTooltip.position} align="right" />
                )}
              </div>
              <button
                onClick={() => setPromptSharing(!promptSharing)}
                className="focus:outline-none shrink-0"
              >
                {promptSharing ? (
                  <div className="w-7 h-4 bg-[#19c37d] rounded-full flex items-center justify-end p-0.5 transition-colors duration-200">
                    <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                  </div>
                ) : (
                  <div className="w-7 h-4 bg-[#333336] rounded-full flex items-center justify-start p-0.5 transition-colors duration-200">
                    <div className="w-3 h-3 bg-[#a1a1aa] rounded-full shadow-sm" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        {showAiInsights && (
          <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-[#8b5cf6]/8 via-[#141414] to-[#ec4899]/5 border border-[#8b5cf6]/20 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] flex items-center justify-center shadow-md">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI-Generated Insights</h3>
                <p className="text-[10px] text-[#a1a1aa] font-medium">Based on {selectedPeriod === '1d' ? 'last 24 hours' : selectedPeriod === '7d' ? 'last 7 days' : selectedPeriod === '30d' ? 'last 30 days' : selectedPeriod === '7w' ? 'last 7 weeks' : selectedPeriod === 'all' ? 'all-time data' : 'selected range'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#1c1c1e]/80 rounded-lg border border-[#2d2d30]">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp size={12} className="text-[#19c37d]" />
                  <span className="text-[10px] text-[#19c37d] font-bold uppercase tracking-wider">Growth</span>
                </div>
                <p className="text-[11px] text-[#d4d4d8] leading-relaxed">
                  <b className="text-white">{activeKpis.totalChats.toLocaleString()} total chats</b> with <b className="text-white">{activeKpis.uniqueUsers.toLocaleString()} unique users</b>. 
                  {activeKpis.totalChatsTrend > 0 
                    ? `Growth is trending positively at +${activeKpis.totalChatsTrend}%. Focus on maintaining this momentum.`
                    : `Growth has slowed to ${activeKpis.totalChatsTrend}%. Consider refreshing conversation starters or promoting your GPT.`
                  }
                </p>
              </div>
              <div className="p-3.5 bg-[#1c1c1e]/80 rounded-lg border border-[#2d2d30]">
                <div className="flex items-center gap-1.5 mb-2">
                  <Activity size={12} className="text-[#8b5cf6]" />
                  <span className="text-[10px] text-[#8b5cf6] font-bold uppercase tracking-wider">Engagement</span>
                </div>
                <p className="text-[11px] text-[#d4d4d8] leading-relaxed">
                  Average session length is <b className="text-white">{activeKpis.avgSessionLength}</b> with <b className="text-white">{activeKpis.avgMessagesPerConvo} msgs/convo</b>. 
                  {activeKpis.bounceRate > 25 
                    ? `Bounce rate at ${activeKpis.bounceRate}% is high — improve your opening message or starter prompts.`
                    : `Bounce rate at ${activeKpis.bounceRate}% is healthy. Users are finding value quickly.`
                  }
                </p>
              </div>
              <div className="p-3.5 bg-[#1c1c1e]/80 rounded-lg border border-[#2d2d30]">
                <div className="flex items-center gap-1.5 mb-2">
                  <Users size={12} className="text-[#f59e0b]" />
                  <span className="text-[10px] text-[#f59e0b] font-bold uppercase tracking-wider">Retention</span>
                </div>
                <p className="text-[11px] text-[#d4d4d8] leading-relaxed">
                  <b className="text-white">{activeKpis.returningUsers}%</b> of users return within 7 days. 
                  Activation rate is <b className="text-white">{activeKpis.activationRate}%</b>. 
                  {activeKpis.returningUsers < 30 
                    ? 'Focus on improving first-session experience to boost retention.'
                    : 'Retention is strong — consider adding advanced features for power users.'
                  }
                </p>
              </div>
              <div className="p-3.5 bg-[#1c1c1e]/80 rounded-lg border border-[#2d2d30]">
                <div className="flex items-center gap-1.5 mb-2">
                  <Zap size={12} className="text-[#ec4899]" />
                  <span className="text-[10px] text-[#ec4899] font-bold uppercase tracking-wider">Recommended Actions</span>
                </div>
                <p className="text-[11px] text-[#d4d4d8] leading-relaxed">
                  {activeKpis.bounceRate > 25 && '• Revise conversation starters to reduce bounce rate. '}
                  {activeKpis.returningUsers < 30 && '• Add personalization to boost returning users. '}
                  {activeKpis.avgTokensPerSession > 2000 && '• Token usage is high — optimize system instructions for efficiency. '}
                  {activeKpis.activationRate < 60 && '• Improve onboarding flow to increase activation rate. '}
                  {activeKpis.bounceRate <= 25 && activeKpis.returningUsers >= 30 && activeKpis.activationRate >= 60 && 'Your GPT is performing well across all key metrics. Keep monitoring weekly trends for sustained growth.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KPI groups */}
        <div className="space-y-4 mb-6">
          {/* Row 1 — Engagement */}
          <div>
            <p className="text-xs font-bold text-[#a1a1aa] uppercase tracking-widest mb-2.5">Engagement</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <KPI 
                label="Total Chats"  
                value={activeKpis.totalChats.toLocaleString()}  
                trend={activeKpis.totalChatsTrend} 
                icon={MessageSquare} 
                accent="#19c37d" 
                definition={METRIC_DEFINITIONS['Total Chats']}
                hideTrend={selectedPeriod === 'all'}
              />
              <KPI 
                label="Unique Users" 
                value={activeKpis.uniqueUsers.toLocaleString()} 
                trend={activeKpis.uniqueUsersTrend} 
                icon={Users}         
                accent="#6366f1" 
                definition={METRIC_DEFINITIONS['Unique Users']}
                hideTrend={selectedPeriod === 'all'}
              />
              <KPI 
                label="Avg Session"  
                value={activeKpis.avgSessionLength}                        
                icon={Clock}         
                accent="#06b6d4" 
                definition={METRIC_DEFINITIONS['Avg Session']}
                hideTrend={selectedPeriod === 'all'}
              />
              <KPI 
                label="Msgs / Convo"  
                value={activeKpis.avgMessagesPerConvo}          
                trend={activeKpis.msgsTrend}  
                icon={BarChart2}     
                accent="#f59e0b" 
                definition={METRIC_DEFINITIONS['Msgs / Convo']}
                hideTrend={selectedPeriod === 'all'}
              />
            </div>
          </div>
          {/* Row 2 — Quality */}
          <div>
            <p className="text-xs font-bold text-[#a1a1aa] uppercase tracking-widest mb-2.5">Quality</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <KPI 
                label="Activation Rate"  
                value={`${activeKpis.activationRate}%`}   
                trend={activeKpis.activationTrend}  
                icon={Zap}         
                accent="#10b981" 
                definition={METRIC_DEFINITIONS['Activation Rate']}
                hideTrend={selectedPeriod === 'all'}
              />
              <KPI 
                label="Returning Users"  
                value={`${activeKpis.returningUsers}%`}   
                trend={activeKpis.returningTrend}  
                icon={Activity}    
                accent="#8b5cf6" 
                definition={METRIC_DEFINITIONS['Returning Users']}
                hideTrend={selectedPeriod === 'all'}
              />
              <KPI 
                label="Bounce Rate"      
                value={`${activeKpis.bounceRate}%`}        
                trend={activeKpis.bounceTrend} 
                icon={TrendingDown} 
                accent="#ef4444" 
                definition={METRIC_DEFINITIONS['Bounce Rate']}
                hideTrend={selectedPeriod === 'all'}
              />
              <KPI 
                label="Avg Tokens / Session" 
                value={activeKpis.avgTokensPerSession.toLocaleString()} 
                icon={Cpu}     
                accent="#ec4899" 
                definition={METRIC_DEFINITIONS['Avg Tokens / Session']}
                hideTrend={selectedPeriod === 'all'}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 mb-5 border-b border-[#262626]">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'px-4 py-2.5 text-sm font-medium transition-all -mb-px border-b-2 whitespace-nowrap tab-indicator',
                activeTab === tab.id
                  ? 'text-[#f4f4f5] border-[#f4f4f5]'
                  : 'text-[#71717a] border-transparent hover:text-[#a1a1aa] hover:border-[#3f3f46]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'Overview'   && <OverviewTab   data={data} selectedPeriod={selectedPeriod} />}
        {activeTab === 'Models'     && <ModelsTab     data={data} />}
        {activeTab === 'Tools'      && <ToolsTab      data={data} />}
        {activeTab === 'Knowledge'  && <KnowledgeTab  data={data} />}
        {activeTab === 'Retention'  && <RetentionTab  data={data} />}
        {activeTab === 'Safety'     && <SafetyTab     data={data} />}

        {/* Footer */}
        <div className="mt-6 p-4 rounded-xl bg-[#141414] border border-[#262626]">
          <div className="flex items-start gap-2">
            <Info size={12} className="text-[#71717a] mt-0.5 shrink-0" />
            <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
              <span className="text-[#d4d4d8] font-semibold">Privacy-safe: </span>
              All metrics are aggregated and anonymized. No individual user data is surfaced.
              Bounce = sessions with one message. Session length measured server-side.
              <span className="text-[#d4d4d8] font-semibold"> Refreshed 2h ago.</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
