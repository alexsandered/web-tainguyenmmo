import React, { useState } from 'react';
import { Navbar } from './components/landing/Navbar';
import { Hero } from './components/landing/Hero';
import { Features } from './components/landing/Features';
import { TrendingCategories } from './components/landing/TrendingCategories';
import { Footer } from './components/landing/Footer';
import { AuthModal } from './components/landing/AuthModal';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import DashboardApp from './DashboardApp';
import AdminApp from './AdminApp';

export default function App() {
  const [view, setView] = useState<'landing' | 'user' | 'admin'>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Global Announcement State
  const [announcement, setAnnouncement] = useState('🔥 <b>Siêu Sale:</b> Giảm giá 20% tất cả tài khoản Netflix Premium trong hôm nay!');
  const [showAnnounceOnLanding, setShowAnnounceOnLanding] = useState(true);
  const [showAnnounceOnDashboard, setShowAnnounceOnDashboard] = useState(true);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const handleOpenAuth = (tab: 'login' | 'register') => {
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
    setView('user');
  };

  const handleSaveAnnouncement = (text: string, landing: boolean, dashboard: boolean) => {
    setAnnouncement(text);
    setShowAnnounceOnLanding(landing);
    setShowAnnounceOnDashboard(dashboard);
    setIsBannerVisible(true); // Re-show if it was closed
  };

  if (view === 'admin') {
    return (
      <AdminApp 
        onSwitchToUser={() => setView('user')} 
        onLogout={() => setView('landing')}
        announcement={announcement}
        showOnLanding={showAnnounceOnLanding}
        showOnDashboard={showAnnounceOnDashboard}
        onSaveAnnouncement={handleSaveAnnouncement}
      />
    );
  }

  if (view === 'user') {
    return (
      <>
        <AnnouncementBanner 
          message={announcement} 
          isVisible={isBannerVisible && showAnnounceOnDashboard} 
          onClose={() => setIsBannerVisible(false)} 
        />
        <DashboardApp 
          onLogout={() => setView('landing')} 
          onSwitchToAdmin={() => setView('admin')}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-indigo-500/30 flex flex-col">
      <AnnouncementBanner 
        message={announcement} 
        isVisible={isBannerVisible && showAnnounceOnLanding} 
        onClose={() => setIsBannerVisible(false)} 
      />
      
      <Navbar onOpenAuth={handleOpenAuth} />
      
      <main className="flex-1">
        <Hero 
          onExplore={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} 
          onRegister={() => handleOpenAuth('register')} 
        />
        <Features />
        <TrendingCategories onRequireAuth={() => handleOpenAuth('login')} />
      </main>

      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
