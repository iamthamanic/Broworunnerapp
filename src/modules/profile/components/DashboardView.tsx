import { Settings, Umbrella, Coins, GraduationCap, CheckSquare, ChevronDown, Calendar, AlertTriangle } from 'lucide-react';
import styles from './DashboardView.module.scss';
import { useState } from 'react';

interface DashboardViewProps {
  userName: string;
  employeeId?: string;
  profilePhoto?: string;
  onMyDataClick?: () => void;
  onPlanungClick?: () => void;
  onUnfallmeldenClick?: () => void;
}

export function DashboardView({
  userName,
  employeeId = 'PN-20250001',
  profilePhoto,
  onMyDataClick,
  onPlanungClick,
  onUnfallmeldenClick,
}: DashboardViewProps): JSX.Element {
  const [showMyDataButton, setShowMyDataButton] = useState(true);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMyDataClick = () => {
    setShowMyDataButton(false);
    onMyDataClick?.();
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Profile Header Section */}
      <div className={styles.profileHeader}>
        <div className={styles.profileLeft}>
          {profilePhoto ? (
            <img src={profilePhoto} alt={userName} className={styles.profilePhoto} />
          ) : (
            <div className={styles.profileInitials}>{getInitials(userName)}</div>
          )}
          <div className={styles.profileInfo}>
            <div className={styles.greeting}>Hallo, {userName}!</div>
            <div className={styles.employeeId}>Personalnummer: {employeeId}</div>
          </div>
        </div>
        <div className={styles.buttonGroup}>
          {showMyDataButton && (
            <button className={styles.myDataButton} onClick={handleMyDataClick}>
              <Settings size={16} />
              Meine Daten
            </button>
          )}
          <button className={styles.planungButton} onClick={onPlanungClick}>
            <Calendar size={16} />
            Planung
          </button>
          <button className={styles.unfallmeldenButton} onClick={onUnfallmeldenClick}>
            <AlertTriangle size={16} />
            Unfall melden
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {/* Urlaub Card */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Urlaub</span>
            <div className={styles.statIcon} style={{ backgroundColor: '#FFF4ED' }}>
              <Umbrella size={18} style={{ color: '#F97316' }} />
            </div>
          </div>
          <div className={styles.statValue}>30</div>
          <div className={styles.statSubtext}>von 30 Tagen</div>
        </div>

        {/* Coins Card */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Coins</span>
            <div className={styles.statIcon} style={{ backgroundColor: '#FFF4ED' }}>
              <Coins size={18} style={{ color: '#F97316' }} />
            </div>
          </div>
          <div className={styles.statValue}>850</div>
          <div className={styles.statSubtext}>Kontostand</div>
        </div>

        {/* Lernzentrum Card */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Lernzentrum</span>
            <div className={styles.statIcon} style={{ backgroundColor: '#EBF5FF' }}>
              <GraduationCap size={18} style={{ color: '#3B82F6' }} />
            </div>
          </div>
          <div className={styles.statValue}>0</div>
          <div className={styles.statSubtext}>XP (Level 0)</div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>

      {/* Organigramm Section */}
      <div className={styles.organigrammSection}>
        <div className={styles.organigrammHeader}>
          <div className={styles.organigrammTitle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            Organigramm
          </div>
          <button className={styles.organigrammToggle}>
            <ChevronDown size={18} />
            Anzeigen
          </button>
        </div>
      </div>
    </div>
  );
}