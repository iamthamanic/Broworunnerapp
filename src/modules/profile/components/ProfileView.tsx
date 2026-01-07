import { useState } from 'react';
import { Settings, Bell, CircleHelp, FileText, LogOut, ChevronRight, Clock, Calendar, TrendingUp } from 'lucide-react';
import { PlanningView } from '../../orders/components/PlanningView';
import { MyDataView } from '../../orders/components/MyDataView';
import styles from './ProfileView.module.scss';

type ProfileTab = 'planning' | 'mydata';

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
  const [activeTab, setActiveTab] = useState<ProfileTab>('planning');

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
      <div className={styles.header}>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>{getInitials(userName)}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{userName}</div>
            <div className={styles.userRole}>{userRole}</div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className={styles.profileTabs}>
          <button
            className={`${styles.profileTab} ${
              activeTab === 'planning' ? styles.profileTabActive : ''
            }`}
            onClick={() => setActiveTab('planning')}
          >
            In Planung
          </button>
          <button
            className={`${styles.profileTab} ${
              activeTab === 'mydata' ? styles.profileTabActive : ''
            }`}
            onClick={() => setActiveTab('mydata')}
          >
            Meine Daten
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'planning' && <PlanningView />}
      
      {activeTab === 'mydata' && (
        <MyDataView
          todayWorkTime={todayWorkTime}
          weekWorkTime={weekWorkTime}
          monthWorkTime={monthWorkTime}
          targetHoursPerDay={targetHoursPerDay}
          timeEntries={timeEntries}
          onSettingsClick={onSettingsClick}
          onNotificationsClick={onNotificationsClick}
          onDocumentsClick={onDocumentsClick}
          onHelpClick={onHelpClick}
        />
      )}
    </div>
  );
}