# CustomGPT Analytics Dashboard

A concept analytics dashboard that reimagines how ChatGPT custom GPT creators could track and analyze their GPT's performance. Built as a pixel-perfect extension of ChatGPT's native dark UI, this dashboard provides comprehensive analytics across engagement, retention, tool usage, knowledge base performance, and safety metrics.
<div style="text-align: center;">
<img width="1364" height="635" alt="image" src="https://github.com/user-attachments/assets/2d449b41-5930-4972-bd4f-bbfe3a706f6f" />

</div>
> **Note:** This is a concept/demo project. It uses mock data.

---

## ✨ Features

### 📊 Multi-GPT Management
- **My GPTs** — View and manage all your custom GPTs with search, filtering, and quick actions
- **All GPTs Overview** — Aggregate KPIs, stacked area charts, and per-GPT performance comparison across your entire portfolio

### 📈 Per-GPT Analytics Dashboard
- **8 KPI Cards** across Engagement & Quality rows — Total Chats, Unique Users, Avg Session, Msgs/Convo, Activation Rate, Returning Users, Bounce Rate, Tokens/Session
- **6 Deep-Dive Tabs:**
  - **Overview** — Daily active chats, growth %, token & prompt stats, user drop-off curve, conversation quality, GitHub-style active days grid, time-of-day activity
  - **Models** — Model distribution donut, switching frequency, per-model session depth comparison
  - **Tools** — Usage breakdown for Web Search, Canvas, Image Gen, Code Interpreter, Voice Mode, File Upload with retention/latency metrics
  - **Knowledge** — File-level retrieval rates, success rates, contribution %, abandonment rates, retrieval volume over time
  - **Retention** — Conversion funnel, conversation starter performance, cohort retention heatmap, returning user trends
  - **Safety & Performance** — Refusal rate, sensitive topics, hallucination suspicion, latency metrics, policy event timeline, refusal categories

### 🤖 AI-Generated Insights
- One-click AI insights panel that generates contextual analysis across Growth, Engagement, Retention, and Recommended Actions — dynamically adapts to selected time period

### 🎨 Design & UX
- Pixel-perfect ChatGPT dark theme (#212121 background, #141414 cards)
- Booking-style interactive date range calendar with preset sidebar
- Smart viewport-aware tooltip positioning
- Scroll-reveal entrance animations for cards and sections
- Hover micro-interactions on all interactive elements
- Anonymous prompt sharing toggle with descriptive tooltip
- CSV export for all analytics data
- Fully responsive layout

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Recharts** | Charts (Area, Bar, Line, Pie) |
| **Tailwind CSS 3** | Utility-first styling |
| **Lucide React** | Icon system |
| **React Router v7** | Client-side routing |
| **clsx** | Conditional class composition |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/customgpt-analytics.git
cd customgpt-analytics

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Production Build

```bash
npm run build
npm run preview
```

---

## 💡 Inspiration

This project was born from a simple question: **What if custom GPT creators had access to real analytics?**

As a custom GPT creator, I wanted to visualize the kind of metrics that would help builders understand how their GPTs are performing — engagement patterns, user retention, tool adoption, knowledge base effectiveness, and safety compliance. Since OpenAI doesn't currently expose granular analytics for custom GPTs, I built this concept dashboard to explore what that experience could look like.

The design philosophy was to make it feel like a native ChatGPT feature — same dark theme, same typography, same interaction patterns — so it feels like a natural extension of the platform rather than a third-party tool.

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Root with React Router setup
├── main.jsx                   # Entry point
├── index.css                  # Global styles & animations
├── data/
│   └── mockData.js            # Mock analytics data for 4 GPTs
└── components/
    ├── Sidebar.jsx            # ChatGPT-style sidebar navigation
    ├── MyGPTs.jsx             # GPT list with search & actions
    ├── AllGPTs.jsx            # Aggregate cross-GPT overview
    ├── AnalyticsDashboard.jsx # Main analytics dashboard (6 tabs)
    └── analytics/
        ├── KPICard.jsx        # Reusable KPI card component
        └── SectionCard.jsx    # Reusable section wrapper
```

---

## 📈 Project Status & Roadmap

### Current Progress
- [x] **Production-Readiness Overhaul**
  - Revamped text contrast across all subcomponents (#ffffff & #a1a1aa for high readability)
  - Implemented smooth viewport-reveal animations on dashboard load
  - Resolved Active Days Grid tooltip viewport clipping issues
  - Fixed ChatGPT ChevronDown indicator and SalluTweets logo across MyGPTs cards & headers
  - Configured favicon.svg and detailed SEO headers in index.html
- [x] **"Behind the Build" Case Study & Premium Landing Integration**
  - Set the redesigned, minimalist Case Study narrative as the primary homepage landing route `/`
  - Integrated the two actual user screenshots (ChatGPT SalluTweets workspace & the "80+ Chats" dev listing) inside sleek card frames
  - Cleaned typography layout to be left-aligned and structured (no bloated colors, AI-slop gradients, or massive centered text blocks)
  - Prepend official 𝕏 brand SVG vectors to replace standard legacy Twitter links
  - Wired all incoming dashboard links to automatically open in new tabs (`_blank`)
  - Added a globally fixed `<FloatingStoryButton />` top-right badge to the dashboard so builders can easily toggle back to the story
- [x] **Git & Deployment Initialization**
  - Initialized local git repository for version control

### Next Todos / Roadmap
- [ ] Push code to a remote GitHub repository
- [ ] Set up hosting for the application (e.g., Vercel, Netlify) to serve the React application and its routes
- [ ] Connect real back-end endpoints (e.g. Node.js/Express, Supabase) to log real-time chats
- [ ] Implement user login authentication and multi-tenant creator dashboards
- [ ] Set up auto-reporting alerts to email summary insights directly to custom GPT creators
- [ ] Add dark/light mode customization settings

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
