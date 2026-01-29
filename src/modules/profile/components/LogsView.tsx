import { useState } from 'react';
import { ChevronRight, User, Briefcase, Calendar as CalendarIcon, FileText, Gift, Coins as CoinsIcon, Award, GraduationCap, Shield, Info, AlertTriangle, Clock } from 'lucide-react';
import { useActivityLog } from '../../../contexts/ActivityLogContext';
import styles from './LogsView.module.scss';

type LogCategory = 
  | 'personal' 
  | 'work' 
  | 'absence' 
  | 'documents' 
  | 'benefits' 
  | 'coins' 
  | 'achievements' 
  | 'learning' 
  | 'permissions' 
  | 'general'
  | 'accidents';

interface LogCategoryData {
  id: LogCategory;
  label: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

interface AccidentReport {
  id: string;
  vorgangsnummer: string;
  datum: string;
  uhrzeit: string;
  unfallArt: string;
  schweregrad: string;
  ort: string;
  status: 'in_bearbeitung' | 'abgeschlossen';
  eingereichtAm: number;
}

// Mock accident data - in real app this would come from context/API
const mockAccidents: AccidentReport[] = [
  {
    id: '1',
    vorgangsnummer: 'UNF-12345678',
    datum: '09.01.2026',
    uhrzeit: '14:30',
    unfallArt: 'Arbeitsunfall',
    schweregrad: 'Leicht',
    ort: 'Berliner Str. 123, 10715 Berlin',
    status: 'in_bearbeitung',
    eingereichtAm: Date.now() - 86400000,
  },
];

export function LogsView(): JSX.Element {
  const { logs } = useActivityLog();
  const [expandedCategory, setExpandedCategory] = useState<LogCategory | null>(null);

  // Count accidents from activity logs
  const accidentLogs = logs.filter(log => 
    log.category === 'alert' || log.action.includes('Unfallmeldung')
  );

  const categories: LogCategoryData[] = [
    {
      id: 'personal',
      label: 'Persönliche Daten',
      icon: <User size={20} />,
      count: 0,
      color: '#3c61bc',
    },
    {
      id: 'work',
      label: 'Arbeitsinformationen',
      icon: <Briefcase size={20} />,
      count: 2,
      color: '#3c61bc',
    },
    {
      id: 'absence',
      label: 'Abwesenheiten',
      icon: <CalendarIcon size={20} />,
      count: 0,
      color: '#3c61bc',
    },
    {
      id: 'documents',
      label: 'Dokumente',
      icon: <FileText size={20} />,
      count: 0,
      color: '#3c61bc',
    },
    {
      id: 'benefits',
      label: 'Benefits',
      icon: <Gift size={20} />,
      count: 0,
      color: '#3c61bc',
    },
    {
      id: 'coins',
      label: 'Coins',
      icon: <CoinsIcon size={20} />,
      count: 0,
      color: '#3c61bc',
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: <Award size={20} />,
      count: 0,
      color: '#3c61bc',
    },
    {
      id: 'learning',
      label: 'Lernfortschritt',
      icon: <GraduationCap size={20} />,
      count: 0,
      color: '#3c61bc',
    },
    {
      id: 'permissions',
      label: 'Berechtigungen',
      icon: <Shield size={20} />,
      count: 0,
      color: '#3c61bc',
    },
    {
      id: 'accidents',
      label: 'Unfälle',
      icon: <AlertTriangle size={20} />,
      count: accidentLogs.length,
      color: '#ef4444',
    },
    {
      id: 'general',
      label: 'Allgemein',
      icon: <Info size={20} />,
      count: 0,
      color: '#6b7280',
    },
  ];

  const totalEntries = categories.reduce((sum, cat) => sum + cat.count, 0);

  const handleCategoryClick = (categoryId: LogCategory) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.logsViewContainer}>
      {/* Header */}
      <div className={styles.logsHeader}>
        <div className={styles.headerLeft}>
          <Clock size={24} className={styles.headerIcon} />
          <h1 className={styles.headerTitle}>Logs</h1>
        </div>
        <div className={styles.entriesCount}>
          {totalEntries} {totalEntries === 1 ? 'Eintrag' : 'Einträge'}
        </div>
      </div>

      {/* Categories List */}
      <div className={styles.categoriesList}>
        {categories.map((category) => (
          <div key={category.id} className={styles.categorySection}>
            <button
              className={`${styles.categoryItem} ${
                expandedCategory === category.id ? styles.categoryItemExpanded : ''
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className={styles.categoryLeft}>
                <ChevronRight 
                  size={20} 
                  className={`${styles.chevron} ${
                    expandedCategory === category.id ? styles.chevronRotated : ''
                  }`}
                />
                <div 
                  className={styles.categoryIcon}
                  style={{ color: category.color }}
                >
                  {category.icon}
                </div>
                <span className={styles.categoryLabel}>{category.label}</span>
              </div>
              <span className={styles.categoryCount}>{category.count}</span>
            </button>

            {/* Expanded Content */}
            {expandedCategory === category.id && category.count > 0 && (
              <div className={styles.categoryContent}>
                {category.id === 'accidents' && (
                  <div className={styles.accidentsList}>
                    {accidentLogs.map((log, index) => (
                      <div key={log.id} className={styles.accidentItem}>
                        <div className={styles.accidentHeader}>
                          <div className={styles.accidentVorgang}>
                            Vorgangsnummer: UNF-{log.timestamp.toString().slice(-8)}
                          </div>
                          <div className={styles.accidentStatus}>
                            <span className={styles.statusDot}></span>
                            In Bearbeitung
                          </div>
                        </div>
                        <div className={styles.accidentDetails}>
                          <div className={styles.accidentRow}>
                            <span className={styles.accidentLabel}>Datum:</span>
                            <span className={styles.accidentValue}>
                              {formatDate(log.timestamp)}
                            </span>
                          </div>
                          <div className={styles.accidentRow}>
                            <span className={styles.accidentLabel}>Uhrzeit:</span>
                            <span className={styles.accidentValue}>
                              {formatTime(log.timestamp)}
                            </span>
                          </div>
                          <div className={styles.accidentRow}>
                            <span className={styles.accidentLabel}>Art:</span>
                            <span className={styles.accidentValue}>
                              {log.details?.split(' - ')[0] || 'Arbeitsunfall'}
                            </span>
                          </div>
                          <div className={styles.accidentRow}>
                            <span className={styles.accidentLabel}>Eingereicht:</span>
                            <span className={styles.accidentValue}>
                              {formatDate(log.timestamp)} um {formatTime(log.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {category.id === 'work' && (
                  <div className={styles.workInfoList}>
                    <div className={styles.workInfoItem}>
                      <div className={styles.workInfoLabel}>Letzte Aktualisierung</div>
                      <div className={styles.workInfoValue}>08.01.2026, 09:15 Uhr</div>
                    </div>
                    <div className={styles.workInfoItem}>
                      <div className={styles.workInfoLabel}>Status</div>
                      <div className={styles.workInfoValue}>Aktiv</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
