import React from 'react';

export default function SectionCard({ title, subtitle, children, action }) {
  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
        <div>
          <h3 className="text-sm font-semibold text-[#ececec]">{title}</h3>
          {subtitle && <p className="text-xs text-[#8e8ea0] mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
