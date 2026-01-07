import { Clock, Calendar, Settings, Bell, FileText, CircleHelp } from 'lucide-react';
import styles from './MyDataView.module.scss';

interface TimeEntry {
  date: string;
  clockIn: string;
  clockOut: string;
  duration: string;
  breaks?: string;
}

interface MyDataViewProps {
  todayWorkTime?: string;
  weekWorkTime?: string;
  monthWorkTime?: string;
  targetHoursPerDay?: number;
  timeEntries?: TimeEntry[];
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
  onDocumentsClick?: () => void;
  onHelpClick?: () => void;
}

export function MyDataView({
  todayWorkTime,
  weekWorkTime,
  monthWorkTime,
  targetHoursPerDay = 8,
  timeEntries = [],
  onSettingsClick,
  onNotificationsClick,
  onDocumentsClick,
  onHelpClick,
}: MyDataViewProps): JSX.Element {
  const defaultTimeEntries: TimeEntry[] = timeEntries.length > 0 ? timeEntries : [
    { date: '05.01.2026', clockIn: '07:30', clockOut: '16:15', duration: '8h 45m', breaks: '45m' },
    { date: '04.01.2026', clockIn: '07:45', clockOut: '16:30', duration: '8h 45m', breaks: '45m' },
    { date: '03.01.2026', clockIn: '08:00', clockOut: '16:45', duration: '8h 45m', breaks: '45m' },
  ];

  return (
    <div className={styles.myDataContainer}>
      {/* Arbeitszeiten Card */}
      <div className={styles.timeCard}>
        <div className={styles.cardHeader}>
          <Clock className={styles.cardIcon} size={20} />
          <h2 className={styles.cardTitle}>Arbeitszeiten</h2>
        </div>

        <div className={styles.timeStats}>
          <div className={styles.timeStatItem}>
            <div className={styles.timeStatLabel}>Heute</div>
            <div className={styles.timeStatValue}>{todayWorkTime || '0:00'}</div>
            <div className={styles.timeStatTarget}>Soll: {targetHoursPerDay}h</div>
          </div>
          <div className={styles.timeStatItem}>
            <div className={styles.timeStatLabel}>Diese Woche</div>
            <div className={styles.timeStatValue}>{weekWorkTime || '0:00'}</div>
            <div className={styles.timeStatTarget}>Soll: {targetHoursPerDay * 5}h</div>
          </div>
          <div className={styles.timeStatItem}>
            <div className={styles.timeStatLabel}>Dieser Monat</div>
            <div className={styles.timeStatValue}>{monthWorkTime || '0:00'}</div>
          </div>
        </div>
      </div>

      {/* Letzte Einträge Card */}
      <div className={styles.entriesCard}>
        <div className={styles.cardHeader}>
          <Calendar className={styles.cardIcon} size={20} />
          <h2 className={styles.cardTitle}>Letzte Einträge</h2>
        </div>

        <div className={styles.entriesList}>
          {defaultTimeEntries.map((entry, index) => (
            <div key={index} className={styles.entryItem}>
              <div className={styles.entryDate}>
                <Calendar size={14} />
                {entry.date}
              </div>
              <div className={styles.entryDetails}>
                <span className={styles.entryTime}>
                  {entry.clockIn} - {entry.clockOut}
                </span>
                <span className={styles.entryDuration}>{entry.duration}</span>
              </div>
              {entry.breaks && (
                <div className={styles.entryBreaks}>Pause: {entry.breaks}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Einstellungen Card */}
      <div className={styles.settingsCard}>
        <div className={styles.cardHeader}>
          <Settings className={styles.cardIcon} size={20} />
          <h2 className={styles.cardTitle}>Einstellungen</h2>
        </div>

        <div className={styles.settingsList}>
          <button className={styles.settingsItem} onClick={onSettingsClick}>
            <div className={styles.settingsItemLeft}>
              <Settings className={styles.settingsIcon} size={20} />
              <span className={styles.settingsLabel}>Allgemeine Einstellungen</span>
            </div>
            <div className={styles.settingsArrow}>›</div>
          </button>

          <button className={styles.settingsItem} onClick={onNotificationsClick}>
            <div className={styles.settingsItemLeft}>
              <Bell className={styles.settingsIcon} size={20} />
              <span className={styles.settingsLabel}>Benachrichtigungen</span>
            </div>
            <div className={styles.settingsArrow}>›</div>
          </button>

          <button className={styles.settingsItem} onClick={onDocumentsClick}>
            <div className={styles.settingsItemLeft}>
              <FileText className={styles.settingsIcon} size={20} />
              <span className={styles.settingsLabel}>Dokumente</span>
            </div>
            <div className={styles.settingsArrow}>›</div>
          </button>

          <button className={styles.settingsItem} onClick={onHelpClick}>
            <div className={styles.settingsItemLeft}>
              <CircleHelp className={styles.settingsIcon} size={20} />
              <span className={styles.settingsLabel}>Hilfe & Support</span>
            </div>
            <div className={styles.settingsArrow}>›</div>
          </button>
        </div>
      </div>
    </div>
  );
}
