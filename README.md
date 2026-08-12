# FreshJobs & Exams Tracker 🚀

A full-stack web application built specifically for recent **MCA & Fresher Graduates** to track entry-level IT job drives (strictly **last 7 days**) and academic/teaching exam updates (UGC NET, SET, GATE, CTET).

---

## 🌟 Key Features

1. **Latest Jobs Page (`/jobs`)**
   - Hard Filter: Displays entry-level postings from major IT firms (TCS, IBM, Google, Microsoft, Infosys, Wipro, Accenture, Amazon).
   - Automatically excludes/archives postings older than 7 days from the default view.
   - Includes a **"Show older (archived)"** toggle to review past hiring drives.
   - Fresher-only filter switch enabled by default.
   - Search bar by keyword, company selector, and direct links to official company careers portals.

2. **Exam Updates Page (`/exams`)**
   - Comprehensive tracking for UGC NET, Kerala SET, AP SET, GATE 2027, and CTET.
   - Sorted by nearest application closing deadline.
   - **15-Day Urgency Badge**: Automatically highlights exams with application deadlines in the next 15 days.

3. **Home Dashboard (`/`)**
   - Quick summary metrics ("X new jobs this week", "Y upcoming exam deadlines", "Z bookmarks saved").
   - Featured recent job cards and upcoming exam notification ticker.

4. **Bookmarks (`/saved`)**
   - Save/bookmark jobs and exam updates for quick retrieval across sessions.

5. **Admin Exam Manager (`/admin/exams`)**
   - Form/Modal to manually add, edit, or delete exam notifications with real-time deadline calculation.

6. **Pluggable Job Source Adapter Engine & Background Scheduler**
   - Modular backend adapter structure (`ArbeitnowAdapter`, `AdzunaAdapter`, `JSearchAdapter`, `MockAdapter`).
   - Integrated `node-cron` background task running every 6 hours to fetch new feeds and auto-archive postings older than 7 days.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS (Dark Glassmorphism UI), Lucide Icons, React Router v6, Axios
- **Backend**: Node.js + Express
- **Database & ORM**: SQLite (via Prisma ORM for instant zero-config local run)
- **Scheduler**: `node-cron`
- **Adapter Layer**: Pluggable `BaseAdapter` standardizing raw job payloads

---

## 🚀 Quick Start (Local Development)

### 1. Install Root Dependencies
```bash
# In project root
npm install
npm install --prefix server
npm install --prefix client
```

### 2. Database Setup (SQLite + Seed Data)
```bash
cd server
npx prisma db push
node prisma/seed.js
cd ..
```

### 3. Run Application (`npm run dev`)
Run both backend Express server (port 5000) and frontend Vite app (port 3000) concurrently:
```bash
npm run dev
```

Open your browser at: **`http://localhost:3000`**

---

## 🔑 How to Add Real API Keys for Job Sources

Live job API keys can be added in `server/.env`. By default, `USE_MOCK_DATA=true` provides realistic mock job listings for major tech employers.

To plug in real API providers:

1. Open `server/.env` (or copy from `server/.env.example`).
2. Add your credentials:

```env
# Adzuna API (Free Tier: https://developer.adzuna.com/)
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key

# RapidAPI (JSearch / LinkedIn Jobs: https://rapidapi.com/letscrape-6582-7354/api/jsearch)
RAPIDAPI_KEY=your_rapidapi_key
```

3. Restart the server or click **"Sync Live Feeds"** in the top navigation bar.

---

## 🔌 How to Add a New Company / Job Source Adapter

Adding a new job source requires adding **only one adapter file** without touching existing routes or UI components:

1. Create a new file in `server/src/adapters/` (e.g., `server/src/adapters/LinkedInAdapter.js`):

```javascript
const BaseAdapter = require('./BaseAdapter');
const axios = require('axios');

class LinkedInAdapter extends BaseAdapter {
  constructor() {
    super('LinkedIn Adapter');
  }

  async fetchJobs(options = {}) {
    // 1. Fetch data from endpoint / feed
    const rawJobs = await axios.get('https://api.example.com/jobs');

    // 2. Map payload to normalized schema
    return rawJobs.data.map(item => this.normalizeJob({
      externalId: item.id,
      company: item.company_name,
      logoUrl: item.logo,
      title: item.title,
      location: item.location || 'India',
      experienceLevel: 'Fresher (0-2 Yrs)',
      postedDate: new Date(item.published_at),
      applyUrl: item.careers_link,
      source: 'LinkedIn Feed'
    }));
  }
}

module.exports = LinkedInAdapter;
```

2. Register your new adapter in `server/src/adapters/AdapterManager.js`:

```javascript
const LinkedInAdapter = require('./LinkedInAdapter');

// Inside constructor:
this.registerAdapter(new LinkedInAdapter());
```

3. Run `/api/jobs/sync` or click **"Sync Live Feeds"** in the navbar to test your new adapter!

---

## 📝 How to Seed / Update Exam Data

Exam notification dates change periodically and are maintained cleanly via seed scripts or the Admin UI:

### Method A: Admin Web UI (Recommended)
1. Navigate to **`http://localhost:3000/admin/exams`**.
2. Click **"Add Exam Entry"** or click the edit icon next to any existing exam.
3. Update exam name, conducting body, application dates, and official notification link. Click Save.

### Method B: Seed Script
1. Edit `server/prisma/seed.js` under the `examsData` array.
2. Re-run the seed script:
```bash
npm run db:seed
```

---

## 📁 Project Structure

```
job_apply_portal/
├── client/                 # React + Vite Frontend
│   ├── src/
│   │   ├── api/            # Axios Client
│   │   ├── components/     # Navbar, JobCard, ExamCard, StatCard, FilterBar
│   │   ├── pages/          # Home, Jobs, Exams, Saved, AdminExams
│   │   ├── App.jsx
│   │   └── index.css       # Tailwind + Glassmorphism Styling
│   └── vite.config.js
├── server/                 # Express + Prisma Backend
│   ├── prisma/             # SQLite Schema & Seed Script
│   ├── src/
│   │   ├── adapters/       # BaseAdapter, Arbeitnow, Adzuna, JSearch, MockAdapter
│   │   ├── controllers/    # job, exam, saved, stats controllers
│   │   ├── cron/           # scheduler.js (auto-sync & 7-day purging)
│   │   ├── routes/         # Express API routes
│   │   └── index.js
│   └── .env.example
├── package.json            # Root runner
└── README.md
```

---

## 🚢 Deployment Ready

- **Frontend (Vercel)**: Point Vercel to `client/` directory (`npm run build`).
- **Backend (Render / Railway)**: Deploy `server/` directory. Set `DATABASE_URL` to PostgreSQL URL (e.g. `postgresql://...`) and update `provider = "postgresql"` in `prisma/schema.prisma`.
