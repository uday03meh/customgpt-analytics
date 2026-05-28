import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Globe, Lock, BarChart2, Pencil,
  MoreHorizontal, MessageSquare, Eye, Trash2, Share2,
  ChevronRight, Grid3X3, Sparkles
} from 'lucide-react';
import { myGPTs } from '../data/mockData';
import clsx from 'clsx';

function GPTCard({ gpt, onAnalytics, index }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={clsx(
        "flex items-center gap-4 px-4 py-3.5 rounded-xl border border-[#262626] bg-[#0f0f0f] hover:bg-[#141414] hover:border-[#383838] transition-all cursor-pointer relative card-hover",
        visible ? 'animate-fade-slide-up' : 'opacity-0'
      )}
      style={{ animationDelay: `${index * 0.07}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
    >
      {/* Avatar */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 overflow-hidden"
        style={{ backgroundColor: gpt.color + '18', border: `1px solid ${gpt.color}30` }}
      >
        {gpt.logo ? (
          <img src={gpt.logo} alt={gpt.name} className="w-full h-full object-cover" />
        ) : (
          gpt.emoji
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-[#e4e4e7]">{gpt.name}</span>
          <span className={clsx(
            'flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium',
            gpt.visibility === 'public'
              ? 'bg-[#19c37d]/10 text-[#19c37d] border border-[#19c37d]/20'
              : 'bg-[#71717a]/10 text-[#a1a1aa] border border-[#71717a]/20'
          )}>
            {gpt.visibility === 'public' ? <Globe size={9} /> : <Lock size={9} />}
            {gpt.visibility === 'public' ? 'Anyone with link' : 'Only me'}
          </span>
        </div>
        <p className="text-xs text-[#a1a1aa] truncate mt-0.5 max-w-md">{gpt.tagline}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-[11px] text-[#71717a] font-medium">
            <MessageSquare size={10} />
            {gpt.totalChats >= 1000
              ? `${(gpt.totalChats / 1000).toFixed(1)}k Chats`
              : `${gpt.totalChats} Chats`}
          </span>
          <span className="text-[11px] text-[#3f3f46]">·</span>
          <span className="text-[11px] text-[#71717a] font-medium">Updated {gpt.lastUpdated}</span>
        </div>
      </div>

      {/* Actions — visible on hover */}
      <div className={clsx(
        'flex items-center gap-1 transition-all duration-150',
        hovered ? 'opacity-100' : 'opacity-0'
      )}>
        <button
          onClick={(e) => { e.stopPropagation(); onAnalytics(gpt); }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#19c37d]/10 hover:bg-[#19c37d]/20 text-[#19c37d] text-xs font-semibold border border-[#19c37d]/20 hover:border-[#19c37d]/40 transition-all"
        >
          <BarChart2 size={12} />
          Analytics
        </button>

        <button
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-lg hover:bg-[#1e1e1e] text-[#71717a] hover:text-[#e4e4e7] transition-colors"
          title="Edit GPT"
        >
          <Pencil size={13} />
        </button>

        <button
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-lg hover:bg-[#1e1e1e] text-[#71717a] hover:text-[#e4e4e7] transition-colors"
          title="Share GPT"
        >
          <Share2 size={13} />
        </button>

        {/* More dropdown */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
            className="p-2 rounded-lg hover:bg-[#1e1e1e] text-[#71717a] hover:text-[#e4e4e7] transition-colors"
          >
            <MoreHorizontal size={13} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-38 bg-[#161616] border border-[#2a2a2a] rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden min-w-[148px]">
              {[
                { icon: Eye,    label: 'View GPT'  },
                { icon: Pencil, label: 'Edit'       },
                { icon: Share2, label: 'Share'      },
                { icon: Trash2, label: 'Delete', danger: true },
              ].map(({ icon: Icon, label, danger }) => (
                <button key={label} className={clsx(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-[#1e1e1e] transition-colors',
                  danger ? 'text-red-400 hover:text-red-300' : 'text-[#d4d4d8]'
                )}>
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyGPTs({ onAnalytics }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const filtered = myGPTs.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.tagline.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#212121]">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-5 animate-fade-slide-up">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#71717a] mb-2">
              <span className="hover:text-[#a1a1aa] cursor-pointer transition-colors font-medium">Explore GPTs</span>
              <ChevronRight size={11} />
              <span className="text-[#a1a1aa] font-semibold">My GPTs</span>
            </div>
            <h1 className="text-[22px] font-bold text-[#f4f4f5] tracking-tight">My GPTs</h1>
            <p className="text-sm text-[#a1a1aa] mt-1 font-medium">Manage, share and track your custom GPTs</p>
          </div>
          <button 
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-bold rounded-lg transition-colors mt-6 active:scale-[0.97]"
          >
            <Sparkles size={13} />
            Behind the Build Story
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4 animate-fade-slide-up" style={{ animationDelay: '0.05s' }}>
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525252]" />
          <input
            type="text"
            placeholder="Search your GPTs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-[#262626] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#e4e4e7] placeholder:text-[#525252] focus:outline-none focus:border-[#3f3f46] transition-colors"
          />
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-3 mb-4 text-[11px] text-[#71717a] font-medium animate-fade-slide-up" style={{ animationDelay: '0.1s' }}>
          <span>{filtered.length} GPTs</span>
          <span>·</span>
          <span className="text-[#19c37d]/80">{filtered.filter(g => g.visibility === 'public').length} Public</span>
          <span>·</span>
          <span>{filtered.filter(g => g.visibility === 'private').length} Private</span>
          <span>·</span>
          <span>{filtered.reduce((a, g) => a + g.totalChats, 0).toLocaleString()} Total Chats</span>
        </div>

        {/* Analytics hint banner */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#19c37d]/5 border border-[#19c37d]/12 mb-5 animate-fade-slide-up" style={{ animationDelay: '0.15s' }}>
          <BarChart2 size={13} className="text-[#19c37d] mt-0.5 shrink-0" />
          <p className="text-[11px] text-[#a1a1aa] leading-relaxed font-medium">
            <span className="text-[#19c37d] font-bold">New: GPT Analytics. </span>
            Hover any GPT and click <span className="text-[#e4e4e7] font-semibold">Analytics</span> to view sessions, retention, tool usage and more.
            Or click <span className="text-[#e4e4e7] font-semibold">All GPTs</span> in the sidebar to see cross-GPT performance.
          </p>
        </div>

        {/* List */}
        <div className="space-y-2">
          {filtered.map((gpt, i) => (
            <GPTCard key={gpt.id} gpt={gpt} onAnalytics={onAnalytics} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#525252]">
            <Grid3X3 size={28} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No GPTs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
