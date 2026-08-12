import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, ArrowRight, Bookmark, Sparkles } from 'lucide-react';
import { fetchDashboardStats, fetchJobs, fetchExams, toggleSaveItem } from '../api/client';
import StatCard from '../components/StatCard';
import JobCard from '../components/JobCard';
import ExamCard from '../components/ExamCard';

const Home = ({ onUpdateSavedCount }) => {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [urgentExams, setUrgentExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes, examsRes] = await Promise.all([
        fetchDashboardStats(),
        fetchJobs({ limit: 4, fresherOnly: 'true' }),
        fetchExams()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (jobsRes.success) setRecentJobs(jobsRes.jobs);
      if (examsRes.success) {
        setUrgentExams(examsRes.exams.filter(e => e.isUrgent || e.daysRemaining > 0).slice(0, 2));
      }
    } catch (err) {
      console.error('Failed to load home page data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSave = async (itemType, itemId) => {
    try {
      await toggleSaveItem(itemType, itemId);
      await loadData();
      if (onUpdateSavedCount) onUpdateSavedCount();
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Banner */}
      <section className="mono-panel p-8 sm:p-10 rounded-2xl border border-zinc-800 space-y-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-300 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>MCA & Fresher Career Portal</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Track Fresh IT Jobs & Teaching Exams
        </h1>

        <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
          Entry-level job drives from TCS, IBM, Google, Microsoft, Infosys & Amazon. 
          Hard-filtered to the <strong>last 7 days</strong>. Exam notifications for UGC NET, SET, GATE & CTET.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-white text-black hover:bg-zinc-200 font-bold text-xs transition-all"
          >
            <Briefcase className="w-4 h-4" />
            <span>View 7-Day Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/exams"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 font-bold text-xs border border-zinc-800 transition-all"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Exam Notifications</span>
          </Link>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="New Jobs (7 Days)"
          value={stats ? stats.freshJobsCount : '—'}
          description="Fresher postings within 7-day cutoff window."
          icon={Briefcase}
          actionLabel="View Jobs"
          onAction={() => window.location.href = '/jobs'}
        />

        <StatCard
          title="Urgent Exam Deadlines"
          value={stats ? stats.urgentExamsCount : '—'}
          description="Applications closing within the next 15 days."
          icon={GraduationCap}
          actionLabel="Check Deadlines"
          onAction={() => window.location.href = '/exams'}
        />

        <StatCard
          title="Bookmarks Saved"
          value={stats ? stats.savedCount : '—'}
          description="Shortlisted jobs and exam updates."
          icon={Bookmark}
          actionLabel="View Saved"
          onAction={() => window.location.href = '/saved'}
        />
      </section>

      {/* Featured Jobs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h2 className="text-lg font-bold text-white">Latest Fresher Jobs (7 Days)</h2>
          <Link to="/jobs" className="text-xs font-mono text-zinc-400 hover:text-white underline">
            View All ({stats?.freshJobsCount || 0})
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-zinc-500 font-mono text-xs">Loading jobs...</div>
        ) : recentJobs.length === 0 ? (
          <div className="mono-card p-6 text-center text-zinc-500 text-xs rounded-xl">
            No new postings in the last 7 days.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentJobs.map(job => (
              <JobCard key={job.id} job={job} onToggleSave={handleToggleSave} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Exams */}
      {urgentExams.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h2 className="text-lg font-bold text-white">Upcoming Exam Deadlines</h2>
            <Link to="/exams" className="text-xs font-mono text-zinc-400 hover:text-white underline">
              View All Exams
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgentExams.map(exam => (
              <ExamCard key={exam.id} exam={exam} onToggleSave={handleToggleSave} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
