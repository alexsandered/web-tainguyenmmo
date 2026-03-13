import React, { useState } from 'react';
import { AdminLayout } from './components/admin/AdminLayout';
import { OverviewTab } from './components/admin/OverviewTab';
import { ProductsTab } from './components/admin/ProductsTab';
import { AnnouncementsTab } from './components/admin/AnnouncementsTab';
import { UsersTab } from './components/admin/UsersTab';

interface AdminAppProps {
  onSwitchToUser: () => void;
  onLogout: () => void;
  announcement: string;
  showOnLanding: boolean;
  showOnDashboard: boolean;
  onSaveAnnouncement: (text: string, landing: boolean, dashboard: boolean) => void;
}

export default function AdminApp({ onSwitchToUser, onLogout, announcement, showOnLanding, showOnDashboard, onSaveAnnouncement }: AdminAppProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} onSwitchToUser={onSwitchToUser} onLogout={onLogout}>
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'products' && <ProductsTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'announcements' && (
        <AnnouncementsTab 
          currentAnnouncement={announcement}
          showOnLanding={showOnLanding}
          showOnDashboard={showOnDashboard}
          onSave={onSaveAnnouncement}
        />
      )}
      {activeTab === 'orders' && (
        <div className="flex items-center justify-center h-64 text-zinc-500">
          Tính năng đang được phát triển...
        </div>
      )}
    </AdminLayout>
  );
}
