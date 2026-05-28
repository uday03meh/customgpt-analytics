import React from 'react';
import clsx from 'clsx';

export default function KPICard({ label, value, sub, trend, icon: Icon, accent }) {
  const trendPositive = trend > 0;
  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#353535] transition-all group">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-medium text-[#8e8ea0] uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: accent + '15' }}>
            <Icon size={14} style={{ color: accent }} />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-[#ececec] leading-none">{value}</div>
          {sub && <div className="text-[11px] text-[#8e8ea0] mt-1">{sub}</div>}
        </div>
        {trend !== undefined && (
          <span className={clsx(
            'text-[11px] font-medium px-2 py-0.5 rounded-full',
            trendPositive
              ? 'text-[#19c37d] bg-[#19c37d]/10'
              : 'text-red-400 bg-red-400/10'
          )}>
            {trendPositive ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}
