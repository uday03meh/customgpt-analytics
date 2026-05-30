import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MyGPTs from './components/MyGPTs';
import AllGPTs from './components/AllGPTs';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CaseStudy from './components/CaseStudy';
import { myGPTs } from './data/mockData';
import { Sparkles } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

// ─── Wrapper that reads :gptId from URL and renders the dashboard ─────────────
function AnalyticsRoute({ collapsed, setCollapsed }) {
  const { gptId } = useParams();
  const navigate = useNavigate();
  const gpt = myGPTs.find(g => g.id === gptId);

  if (!gpt) return <Navigate to="/gpts" replace />;

  return (
    <Layout
      activeGPT={gpt}
      currentView="analytics"
      collapsed={collapsed}
      setCollapsed={setCollapsed}
    >
      <AnalyticsDashboard gpt={gpt} onBack={() => navigate('/gpts')} />
    </Layout>
  );
}

// ─── Shared layout shell (sidebar + main) ─────────────────────────────────────
function Layout({ children, activeGPT, currentView, collapsed, setCollapsed }) {
  const navigate = useNavigate();

  const openAnalytics = (gpt) => navigate(`/gpts/${gpt.id}/analytics`);
  const goTo = (view) => {
    if (view === 'allGPTs') navigate('/gpts/all');
    else navigate('/gpts');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#212121]">
      <Sidebar
        activeGPT={activeGPT}
        currentView={currentView}
        onOpenAnalytics={openAnalytics}
        onNavigate={goTo}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}

// ─── Page wrappers ─────────────────────────────────────────────────────────────
function MyGPTsPage({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const openAnalytics = (gpt) => navigate(`/gpts/${gpt.id}/analytics`);
  const goTo = (view) => {
    if (view === 'allGPTs') navigate('/gpts/all');
    else navigate('/gpts');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#212121]">
      <Sidebar
        activeGPT={null}
        currentView="myGPTs"
        onOpenAnalytics={openAnalytics}
        onNavigate={goTo}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        <MyGPTs onAnalytics={openAnalytics} />
      </main>
    </div>
  );
}

function AllGPTsPage({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const openAnalytics = (gpt) => navigate(`/gpts/${gpt.id}/analytics`);
  const goTo = (view) => {
    if (view === 'allGPTs') navigate('/gpts/all');
    else navigate('/gpts');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#212121]">
      <Sidebar
        activeGPT={null}
        currentView="allGPTs"
        onOpenAnalytics={openAnalytics}
        onNavigate={goTo}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        <AllGPTs onAnalytics={openAnalytics} />
      </main>
    </div>
  );
}

function AnalyticsPage({ collapsed, setCollapsed }) {
  const { gptId } = useParams();
  const navigate = useNavigate();
  const gpt = myGPTs.find(g => g.id === gptId);
  const openAnalytics = (g) => navigate(`/gpts/${g.id}/analytics`);
  const goTo = (view) => {
    if (view === 'allGPTs') navigate('/gpts/all');
    else navigate('/gpts');
  };

  if (!gpt) return <Navigate to="/gpts" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-[#212121]">
      <Sidebar
        activeGPT={gpt}
        currentView="analytics"
        onOpenAnalytics={openAnalytics}
        onNavigate={goTo}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        <AnalyticsDashboard gpt={gpt} onBack={() => navigate('/gpts')} />
      </main>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [collapsed, setCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);

  // Keep the sidebar collapsed on small screens so the dashboard is usable on mobile
  useEffect(() => {
    const onResize = () => { if (window.innerWidth < 1024) setCollapsed(true); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<CaseStudy />} />
        <Route path="/case-study" element={<Navigate to="/" replace />} />
        <Route path="/story" element={<Navigate to="/" replace />} />
        <Route path="/gpts" element={<MyGPTsPage collapsed={collapsed} setCollapsed={setCollapsed} />} />
        <Route path="/gpts/all" element={<AllGPTsPage collapsed={collapsed} setCollapsed={setCollapsed} />} />
        <Route path="/gpts/:gptId/analytics" element={<AnalyticsPage collapsed={collapsed} setCollapsed={setCollapsed} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </>
  );
}
