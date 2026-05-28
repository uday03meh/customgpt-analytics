import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, FolderOpen, BookOpen, Grid3X3,
  Code2, MoreHorizontal, ChevronRight,
  Plus, LayoutDashboard, PanelLeft, Pin,
  ExternalLink, User, MessageSquare, ChevronDown,
  Sparkles
} from 'lucide-react';
import { myGPTs } from '../data/mockData';
import clsx from 'clsx';

export default function Sidebar({ activeGPT, currentView, onOpenAnalytics, onNavigate, collapsed, setCollapsed }) {
  // Pinned recent items matching the ChatGPT sidebar screenshot
  const recents = [
    { id: 'recent-1', name: 'Half Marathon Pace Advice', pinned: true },
    { id: 'recent-2', name: 'Using Old Laptop for LLM', pinned: false },
    { id: 'recent-3', name: 'Claude Code Auto-Mode', pinned: false }
  ];

  return (
    <aside className={clsx(
      'flex flex-col h-screen bg-[#171717] transition-all duration-200 shrink-0 z-10 select-none text-sans border-r border-[#262626]',
      collapsed ? 'w-[60px]' : 'w-[260px]'
    )}>

      {/* ── Top Bar / ChatGPT title & Collapse ── */}
      <div className="flex items-center justify-between px-3.5 pt-3.5 pb-2">
        {!collapsed && (
          <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => onNavigate('myGPTs')}>
            <span className="text-base font-bold text-[#e4e4e7] hover:text-white transition-colors">ChatGPT</span>
            <ChevronDown size={12} className="text-[#71717a] mt-0.5 group-hover:text-[#a1a1aa] transition-colors" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            'p-2 rounded-lg hover:bg-[#212121] text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors',
            collapsed ? 'mx-auto' : 'ml-auto'
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <PanelLeft size={16} />}
        </button>
      </div>

      {/* ── New Chat Button ── */}
      <div className="px-3 pb-2 pt-1">
        <button 
          onClick={() => onNavigate('myGPTs')}
          className={clsx(
            'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-[#2f2f2f]/30 hover:bg-[#212121] text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.98]',
            collapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <div className="flex items-center gap-2.5">
            <Plus size={16} className="text-white" />
            {!collapsed && <span>New chat</span>}
          </div>
          {!collapsed && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#71717a] shrink-0">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" fill="currentColor"/>
            </svg>
          )}
        </button>
      </div>

      {/* ── Core Navigation Links ── */}
      <nav className="px-3 space-y-0.5">
        {[
          { icon: Search,       label: 'Search chats' },
          { icon: FolderOpen,   label: 'Projects' },
          { icon: BookOpen,     label: 'Library' },
          { icon: Grid3X3,      label: 'Apps' },
          { icon: Code2,        label: 'Codex' },
          { icon: MoreHorizontal, label: 'More' },
        ].map(({ icon: Icon, label }) => (
          <button 
            key={label} 
            className={clsx(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#a1a1aa] hover:text-[#e4e4e7] hover:bg-[#212121] text-sm transition-all',
              collapsed && 'justify-center'
            )}
          >
            <Icon size={16} className="shrink-0" />
            {!collapsed && <span className="font-medium">{label}</span>}
          </button>
        ))}
      </nav>

      {/* ── Divider ── */}
      <div className="mx-3.5 my-3.5 border-t border-[#2f2f2f]/30" />

      {/* ── Scrollable Sidebar Content ── */}
      <div className="flex-1 overflow-y-auto px-3 space-y-4 pb-4 scrollbar-thin">
        
        {/* GPTs section */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-1.5 flex items-center justify-between">
              <span className="text-xs font-bold text-[#71717a] uppercase tracking-wider">GPTs</span>
            </div>
          )}

          <div className="space-y-0.5">
            {/* All GPTs overview entry */}
            <button
              onClick={() => onNavigate('allGPTs')}
              className={clsx(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                currentView === 'allGPTs'
                  ? 'bg-[#212121] text-white font-semibold shadow-sm'
                  : 'text-[#a1a1aa] hover:bg-[#212121] hover:text-white',
                collapsed && 'justify-center'
              )}
              title="All GPTs overview"
            >
              <LayoutDashboard size={16} className="shrink-0" />
              {!collapsed && <span className="truncate">All GPTs</span>}
            </button>

            {/* Individual GPTs */}
            {myGPTs.map((gpt) => (
              <button
                key={gpt.id}
                onClick={() => onOpenAnalytics(gpt)}
                className={clsx(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all group',
                  activeGPT?.id === gpt.id && (currentView === 'myGPTs' || currentView === 'analytics')
                    ? 'bg-[#212121] text-white font-semibold shadow-sm'
                    : 'text-[#a1a1aa] hover:bg-[#212121] hover:text-white',
                  collapsed && 'justify-center'
                )}
                title={gpt.name}
              >
                {gpt.logo ? (
                  <img src={gpt.logo} alt={gpt.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                ) : (
                  <span className="text-base leading-none shrink-0">{gpt.emoji}</span>
                )}
                {!collapsed && <span className="truncate">{gpt.name}</span>}
              </button>
            ))}

            {/* Explore GPTs */}
            {!collapsed && (
              <button
                onClick={() => onNavigate('myGPTs')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#71717a] hover:bg-[#212121] hover:text-[#e4e4e7] transition-all font-medium"
              >
                <Grid3X3 size={16} className="text-[#71717a]" />
                <span>Explore GPTs</span>
              </button>
            )}

            {/* Behind the Build Case Study */}
            <button
              onClick={() => window.open('/', '_blank')}
              className={clsx(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all font-semibold text-purple-400/90 hover:bg-[#212121] hover:text-purple-300",
                collapsed && 'justify-center'
              )}
              title="Behind the Build Story ✨"
            >
              <Sparkles size={16} className="shrink-0 text-purple-400" />
              {!collapsed && <span>Behind the Build</span>}
            </button>
          </div>
        </div>

        {/* Recents section */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-1.5 flex items-center justify-between">
              <span className="text-xs font-bold text-[#71717a] uppercase tracking-wider">Recents</span>
            </div>
          )}

          {collapsed ? (
            <div className="flex justify-center text-[#525252]">
              <MessageSquare size={16} />
            </div>
          ) : (
            <div className="space-y-0.5">
              {recents.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#a1a1aa] hover:bg-[#212121] hover:text-white transition-all text-left group"
                >
                  <span className="truncate pr-2 font-medium">{item.name}</span>
                  {item.pinned && (
                    <Pin size={10} className="text-[#71717a] transform rotate-45 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── User Profile at Bottom ── */}
      <div className="px-3 pb-3.5 pt-2 border-t border-[#2f2f2f]/30 bg-[#171717]">
        <button className={clsx(
          'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#212121] text-[#a1a1aa] hover:text-white transition-all text-left shadow-sm',
          collapsed && 'justify-center'
        )}>
          <div className="w-8 h-8 rounded-full bg-[#ab3b82] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
            UD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#e4e4e7] truncate">Uday</div>
              <div className="text-[11px] text-[#71717a] leading-none mt-0.5">Plus account</div>
            </div>
          )}
          {!collapsed && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#71717a] shrink-0">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M17 17a4 4 0 0 0-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

    </aside>
  );
}
