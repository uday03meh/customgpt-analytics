import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart2, TrendingUp, MessageSquare, Users, ArrowUpRight,
  Zap, Globe, Lock, Info
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { myGPTs, allGPTsAggregate } from '../data/mockData';
import clsx from 'clsx';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 shadow-xl">
      <p className="text-[11px] text-[#a1a1aa] mb-1.5 font-medium">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color || p.stroke }} />
          <span className="text-[#a1a1aa]">{p.name}:</span>
          <span className="text-[#e4e4e7] font-semibold">{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

// Scroll-reveal hook
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function StatCard({ label, value, sub, trend, accent = '#19c37d', definition, delay = 0 }) {
  const [showDef, setShowDef] = useState(false);
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={clsx(
        "bg-[#141414] border border-[#262626] rounded-xl p-4 hover:border-[#383838] transition-all relative group card-hover",
        visible ? 'animate-fade-slide-up' : 'opacity-0'
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest leading-none">{label}</span>
          {definition && (
            <div className="relative">
              <button
                onMouseEnter={() => setShowDef(true)}
                onMouseLeave={() => setShowDef(false)}
                className="text-[#525252] hover:text-[#e4e4e7] transition-colors shrink-0 flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-[#262626]"
              >
                <Info size={11} />
              </button>
              {showDef && (
                <div className="absolute z-[9999] bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-[#1e1e20] border border-[#3a3a3c] rounded-lg shadow-2xl text-[10px] text-[#e4e4e7] normal-case tracking-normal font-normal leading-relaxed text-center">
                  {definition}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1e1e20]" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <p className="text-2xl font-extrabold text-[#ffffff] tracking-tight leading-none mt-1">{value}</p>
      {sub && <p className="text-[11px] text-[#71717a] mt-1.5 font-medium">{sub}</p>}
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <ArrowUpRight size={11} style={{ color: accent }} />
          <span className="text-[11px] font-semibold" style={{ color: accent }}>+{trend}% this week</span>
        </div>
      )}
    </div>
  );
}

const GPT_COLORS = {
  'SalluTweets':       '#f97316',
  'CAT Coach':         '#6366f1',
  'Interview Prep AI': '#10b981',
  'Resume Reviewer':   '#3b82f6',
};

export default function AllGPTs({ onAnalytics }) {
  const agg = allGPTsAggregate;
  const [showVolumeInfo, setShowVolumeInfo] = useState(false);
  const [showCompareInfo, setShowCompareInfo] = useState(false);
  const [showBarInfo, setShowBarInfo] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-[#212121]">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-7 animate-fade-slide-up">
          <h1 className="text-[22px] font-bold text-[#f4f4f5] tracking-tight">All GPTs Overview</h1>
          <p className="text-xs text-[#a1a1aa] mt-1 font-medium">Aggregate performance across all your custom GPTs</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-7">
          <StatCard 
            label="Total Chats"    
            value={agg.totalChats.toLocaleString()}  
            trend={agg.weeklyGrowth} 
            definition="The cumulative sum of all conversation sessions across all your custom GPTs."
            delay={0}
          />
          <StatCard 
            label="Unique Users"   
            value={agg.uniqueUsers.toLocaleString()} 
            sub="across all GPTs" 
            accent="#6366f1" 
            definition="The net total number of distinct active users who have interacted with one or more of your custom GPTs."
            delay={0.05}
          />
          <StatCard 
            label="Total Sessions" 
            value={agg.totalSessions.toLocaleString()} 
            accent="#f59e0b" 
            definition="The total number of interactive session instances recorded across all GPTs."
            delay={0.1}
          />
          <StatCard 
            label="Avg Session"    
            value={agg.avgSessionLength} 
            sub="per conversation" 
            accent="#8b5cf6" 
            definition="The average length of time a user remains active during a conversation session."
            delay={0.15}
          />
        </div>

        {/* Stacked area — all GPTs over time */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 mb-5 relative animate-fade-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-[#f4f4f5]">Chat Volume by GPT</h3>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowVolumeInfo(true)}
                    onMouseLeave={() => setShowVolumeInfo(false)}
                    className="text-[#525252] hover:text-[#e4e4e7] transition-colors shrink-0 flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#262626]"
                  >
                    <Info size={12} />
                  </button>
                  {showVolumeInfo && (
                    <div className="absolute z-[9999] bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#1e1e20] border border-[#3a3a3c] rounded-lg shadow-2xl text-[11px] text-[#e4e4e7] normal-case tracking-normal font-normal leading-relaxed text-left">
                      Daily active chat session volumes charted across all your custom GPTs to see growth trends and comparative usage.
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1e1e20]" />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-[#a1a1aa] mt-0.5 font-medium">Daily chats across all GPTs — last 11 days</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-end">
              {myGPTs.map(g => (
                <span key={g.id} className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa] font-medium">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                  {g.name}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={agg.gptGrowth} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <defs>
                {[
                  { key: 'interview', color: '#10b981' },
                  { key: 'sallu',     color: '#f97316' },
                  { key: 'resume',    color: '#3b82f6' },
                  { key: 'cat',       color: '#6366f1' },
                ].map(({ key, color }) => (
                  <linearGradient key={key} id={`g_${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={color} stopOpacity={0.14} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="interview" name="Interview Prep AI" stroke="#10b981" strokeWidth={2} fill="url(#g_interview)" dot={false} />
              <Area type="monotone" dataKey="sallu"     name="SalluTweets"       stroke="#f97316" strokeWidth={2} fill="url(#g_sallu)"     dot={false} />
              <Area type="monotone" dataKey="resume"    name="Resume Reviewer"   stroke="#3b82f6" strokeWidth={2} fill="url(#g_resume)"    dot={false} />
              <Area type="monotone" dataKey="cat"       name="CAT Coach"         stroke="#6366f1" strokeWidth={2} fill="url(#g_cat)"       dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Per-GPT comparison table */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden mb-5 animate-fade-slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="px-5 py-4 border-b border-[#1f1f1f] flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-[#f4f4f5]">GPT Performance Comparison</h3>
            <div className="relative">
              <button
                onMouseEnter={() => setShowCompareInfo(true)}
                onMouseLeave={() => setShowCompareInfo(false)}
                className="text-[#525252] hover:text-[#e4e4e7] transition-colors shrink-0 flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#262626]"
              >
                <Info size={12} />
              </button>
              {showCompareInfo && (
                <div className="absolute z-[9999] bottom-full left-0 mb-2 w-64 p-3 bg-[#1e1e20] border border-[#3a3a3c] rounded-lg shadow-2xl text-[11px] text-[#e4e4e7] normal-case tracking-normal font-normal leading-relaxed text-left">
                  A tabular comparison showing exact chat volumes, unique active users, and weekly growth percentages for each custom GPT.
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-[#1e1e20]" />
                </div>
              )}
            </div>
          </div>
          <div className="divide-y divide-[#1c1c1f]">
            {agg.perGPT.map((g) => {
              const gptObj = myGPTs.find(m => m.name === g.name);
              return (
                <div
                  key={g.name}
                  onClick={() => gptObj && onAnalytics(gptObj)}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#1c1c1f] cursor-pointer transition-colors group"
                >
                  <span className="text-lg w-7 shrink-0">{g.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#e4e4e7] group-hover:text-white transition-colors">{g.name}</p>
                    <div className="mt-1.5 h-1.5 w-40 bg-[#1e1e21] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(g.chats / agg.perGPT[0].chats) * 100}%`,
                          backgroundColor: g.color,
                          opacity: 0.75
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 text-right">
                    <div>
                      <p className="text-xs font-semibold text-[#e4e4e7]">{g.chats.toLocaleString()}</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5 font-bold uppercase tracking-wider">Chats</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#e4e4e7]">{g.users.toLocaleString()}</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5 font-bold uppercase tracking-wider">Users</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#19c37d]">+{g.growth}%</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5 font-bold uppercase tracking-wider">Growth</p>
                    </div>
                  </div>
                  <BarChart2 size={14} className="text-[#525252] group-hover:text-[#19c37d] transition-colors shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bar comparison */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 animate-fade-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-1.5 mb-4">
            <h3 className="text-sm font-semibold text-[#f4f4f5]">Total Chats by GPT</h3>
            <div className="relative">
              <button
                onMouseEnter={() => setShowBarInfo(true)}
                onMouseLeave={() => setShowBarInfo(false)}
                className="text-[#525252] hover:text-[#e4e4e7] transition-colors shrink-0 flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#262626]"
              >
                <Info size={12} />
              </button>
              {showBarInfo && (
                <div className="absolute z-[9999] bottom-full left-0 mb-2 w-64 p-3 bg-[#1e1e20] border border-[#3a3a3c] rounded-lg shadow-2xl text-[11px] text-[#e4e4e7] normal-case tracking-normal font-normal leading-relaxed text-left">
                  A horizontal bar chart benchmarking the lifetime aggregate conversation count for each individual custom GPT.
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-[#1e1e20]" />
                </div>
              )}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={agg.perGPT} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#a1a1aa' }} axisLine={false} tickLine={false} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="chats" name="Total Chats" radius={[0, 4, 4, 0]}>
                {agg.perGPT.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.72} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
