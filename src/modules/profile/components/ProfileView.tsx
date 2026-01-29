import { useState } from 'react';
import { Settings, Bell, CircleHelp, FileText, LogOut, ChevronRight, Clock, Calendar, TrendingUp } from 'lucide-react';
import { PlanningView } from '../../orders/components/PlanningView';
import { MyDataView } from '../../orders/components/MyDataView';
import { LogsView } from './LogsView';
import { DashboardView } from './DashboardView';
import { BenefitsView } from './BenefitsView';
import { ApplicationsView } from './ApplicationsView';
import { UnfallmeldenView } from './UnfallmeldenView';
import { TopBar } from './TopBar';
import styles from './ProfileView.module.scss';

type ProfileTab = 'dashboard' | 'benefits' | 'applications' | 'mydata' | 'unfallmelden' | 'planung';
type BenefitsSubTab = 'applications' | 'benefits';
type MyDataSubTab = 'mydata' | 'planning';

interface ProfileStats {
  completedToday: number;
  completedWeek: number;
  totalDistance: number;
  avgRating: number;
}

interface TimeEntry {
  date: string;
  clockIn: string;
  clockOut: string;
  duration: string;
  breaks: string;
}

interface ProfileViewProps {
  userName: string;
  userRole: string;
  employeeId?: string;
  profilePhoto?: string;
  stats: ProfileStats;
  currentWorkTime?: string;
  todayWorkTime?: string;
  weekWorkTime?: string;
  monthWorkTime?: string;
  targetHoursPerDay?: number;
  timeEntries?: TimeEntry[];
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
  onHelpClick?: () => void;
  onDocumentsClick?: () => void;
  onLogout?: () => void;
}

export function ProfileView({
  userName,
  userRole,
  employeeId,
  profilePhoto,
  stats,
  currentWorkTime,
  todayWorkTime,
  weekWorkTime,
  monthWorkTime,
  targetHoursPerDay,
  timeEntries,
  onSettingsClick,
  onNotificationsClick,
  onHelpClick,
  onDocumentsClick,
  onLogout,
}: ProfileViewProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<ProfileTab>('dashboard');
  const [activeBenefitsSubTab, setActiveBenefitsSubTab] = useState<BenefitsSubTab>('applications');
  const [activeMyDataSubTab, setActiveMyDataSubTab] = useState<MyDataSubTab>('mydata');

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={styles.profileContainer}>
      <TopBar onLogout={onLogout} />

      {/* Profile Tabs - outside header */}
      <div className={styles.profileTabs}>
        <button
          className={`${styles.profileTab} ${
            activeTab === 'dashboard' ? styles.profileTabActive : ''
          }`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`${styles.profileTab} ${
            activeTab === 'benefits' ? styles.profileTabActive : ''
          }`}
          onClick={() => setActiveTab('benefits')}
        >
          Benefits
        </button>
        <button
          className={`${styles.profileTab} ${
            activeTab === 'applications' ? styles.profileTabActive : ''
          }`}
          onClick={() => setActiveTab('applications')}
        >
          Anträge
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <DashboardView 
          userName={userName}
          employeeId={employeeId}
          profilePhoto={profilePhoto}
          onMyDataClick={() => setActiveTab('mydata')}
          onPlanungClick={() => setActiveTab('planung')}
          onUnfallmeldenClick={() => setActiveTab('unfallmelden')}
        />
      )}

      {activeTab === 'mydata' && (
        <MyDataView />
      )}

      {activeTab === 'benefits' && (
        <BenefitsView />
      )}

      {activeTab === 'applications' && (
        <ApplicationsView />
      )}

      {activeTab === 'unfallmelden' && (
        <UnfallmeldenView onBack={() => setActiveTab('dashboard')} />
      )}

      {activeTab === 'planung' && (
        <PlanningView />
      )}
    </div>
  );
}