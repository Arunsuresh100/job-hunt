import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Jobs from './pages/Jobs';
import KeralaJobs from './pages/KeralaJobs';
import PortalJobs from './pages/PortalJobs';
import Exams from './pages/Exams';
import Saved from './pages/Saved';
import SyncModal from './components/SyncModal';
import AppLoadingScreen from './components/AppLoadingScreen';
import OnboardingModal from './components/OnboardingModal';
import ScrollToTop from './components/ScrollToTop';
import { fetchSavedItems, syncJobs } from './api/client';

function App() {
  const [savedCount, setSavedCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStep, setSyncStep] = useState('');
  const [syncResult, setSyncResult] = useState(null);
  const [syncVersion, setSyncVersion] = useState(0);

  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // User Profile State & Onboarding Modal
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('jobhunt_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const updateSavedCount = async () => {
    try {
      const data = await fetchSavedItems();
      if (data.success) {
        setSavedCount(data.count || 0);
      }
    } catch (err) {
      console.error('Failed to update saved count:', err);
    }
  };

  useEffect(() => {
    updateSavedCount();
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 900);
    const removeTimer = setTimeout(() => {
      setIsAppLoading(false);
      // Auto open onboarding modal if first time visit
      if (!userProfile) {
        setIsOnboardingOpen(true);
      }
    }, 1350);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const handleGlobalSync = async () => {
    setIsSyncing(true);
    setIsSyncModalOpen(true);
    setSyncResult(null);
    setSyncProgress(15);
    setSyncStep('Connecting to Job Feeds & Remotive API...');

    const intervalId = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev < 40) {
          setSyncStep('Fetching Adzuna & Kerala IT Parks drives...');
          return prev + 15;
        } else if (prev < 75) {
          setSyncStep('Filtering entry-level & fresher roles (0-2 yrs)...');
          return prev + 12;
        } else if (prev < 90) {
          setSyncStep('Saving & indexing postings in database...');
          return prev + 5;
        }
        return prev;
      });
    }, 450);

    try {
      const res = await syncJobs();
      clearInterval(intervalId);
      setSyncProgress(100);
      setSyncStep('Sync completed successfully!');
      setSyncResult(res || { success: true, message: 'Sync complete' });
      setSyncVersion((v) => v + 1);
      updateSavedCount();
    } catch (err) {
      clearInterval(intervalId);
      setSyncProgress(100);
      setSyncStep('Sync error occurred');
      setSyncResult({ success: false, message: err.message || 'Network or Server Error' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex flex-col min-h-screen bg-transparent text-slate-100 font-sans antialiased">
        {/* Professional App Startup Loading Screen */}
        {isAppLoading && <AppLoadingScreen isFading={isFadingOut} />}

        {/* App Top Header Bar (Mobile & Desktop) */}
        <Header
          savedCount={savedCount}
          onSync={handleGlobalSync}
          isSyncing={isSyncing}
          userProfile={userProfile}
          onOpenProfileModal={() => setIsOnboardingOpen(true)}
        />

        {/* Onboarding & Profile Modal */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onSaveProfile={(profile) => setUserProfile(profile)}
          initialProfile={userProfile}
        />

        {/* Sync Progress & Action UI Modal */}
        <SyncModal
          isOpen={isSyncModalOpen}
          isSyncing={isSyncing}
          syncResult={syncResult}
          syncStep={syncStep}
          progress={syncProgress}
          onClose={() => setIsSyncModalOpen(false)}
        />

        {/* Main Viewport Content */}
        <main className="flex-grow flex flex-col max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 md:pb-8">

          <Routes>
            <Route path="/" element={<Navigate to="/jobs" replace />} />
            <Route path="/jobs" element={<Jobs key={syncVersion} userProfile={userProfile} onUpdateSavedCount={updateSavedCount} />} />
            <Route path="/kerala-jobs" element={<KeralaJobs key={syncVersion} userProfile={userProfile} onUpdateSavedCount={updateSavedCount} />} />
            <Route path="/portals" element={<PortalJobs key={syncVersion} userProfile={userProfile} onUpdateSavedCount={updateSavedCount} />} />
            <Route path="/exams" element={<Exams key={syncVersion} onUpdateSavedCount={updateSavedCount} />} />
            <Route path="/saved" element={<Saved key={syncVersion} onUpdateSavedCount={updateSavedCount} />} />
            <Route path="*" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </main>

        {/* Universal Floating Scroll To Top Button */}
        <ScrollToTop />

        {/* Mobile App Bottom Navigation Bar (3 Core Options) */}
        <BottomNav savedCount={savedCount} />
      </div>
    </Router>
  );
}

export default App;

