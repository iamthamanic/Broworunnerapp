import { useState, useEffect } from 'react';
import { Plus, FileText, Clock, MapPin, CheckCircle, ChevronRight } from 'lucide-react';
import { BereitschaftModal } from './BereitschaftModal';
import { BereitschaftDetailModal } from './BereitschaftDetailModal';
import { MapTab } from './MapTab';
import { useActivityLog } from '../../../contexts/ActivityLogContext';
import styles from './BereitschaftView.module.scss';

type BereitschaftTab = 'todo' | 'completed';

interface CheckboxItem {
  label: string;
  checked: boolean;
  note: string;
}

interface BereitschaftEntry {
  id: string;
  auftraggeber: string;
  strasse: string;
  plz: string;
  ort: string;
  date: string;
  auftragsannahmeUhrzeit: string;
  ankunftUhrzeit: string;
  arbeitsbeginnUhrzeit: string;
  arbeitsendeUhrzeit: string;
  vorgefundenerSachverhalt: CheckboxItem[];
  durchgefuehrteArbeiten: CheckboxItem[];
  completed: boolean;
}

interface BereitschaftViewProps {
  onNavigateToProfile?: () => void;
}

export function BereitschaftView({ onNavigateToProfile }: BereitschaftViewProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<BereitschaftTab>('todo');
  const [entries, setEntries] = useState<BereitschaftEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<BereitschaftEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<BereitschaftEntry | null>(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [tourStarted, setTourStarted] = useState(false);
  const [workTimeSeconds, setWorkTimeSeconds] = useState(0);
  const { addLog } = useActivityLog();

  const targetHoursPerDay = 8;

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isClockedIn) {
      interval = setInterval(() => {
        setWorkTimeSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClockedIn]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (data: any) => {
    if (editingEntry) {
      // Update existing entry
      setEntries(entries.map(entry => 
        entry.id === editingEntry.id ? { 
          ...entry, 
          auftraggeber: data.auftraggeber,
          strasse: data.strasse,
          plz: data.plz,
          ort: data.ort,
          date: data.auftragsannahmeDatum,
          auftragsannahmeUhrzeit: data.auftragsannahmeUhrzeit,
          ankunftUhrzeit: data.ankunftUhrzeit,
          arbeitsbeginnUhrzeit: data.arbeitsbeginnUhrzeit,
          arbeitsendeUhrzeit: data.arbeitsendeUhrzeit,
          vorgefundenerSachverhalt: data.vorgefundenerSachverhalt,
          durchgefuehrteArbeiten: data.durchgefuehrteArbeiten,
        } : entry
      ));
      setEditingEntry(null);
    } else {
      // Create new entry
      const newEntry: BereitschaftEntry = {
        id: `ber-${Date.now()}`,
        auftraggeber: data.auftraggeber,
        strasse: data.strasse,
        plz: data.plz,
        ort: data.ort,
        date: data.auftragsannahmeDatum,
        auftragsannahmeUhrzeit: data.auftragsannahmeUhrzeit,
        ankunftUhrzeit: data.ankunftUhrzeit,
        arbeitsbeginnUhrzeit: data.arbeitsbeginnUhrzeit,
        arbeitsendeUhrzeit: data.arbeitsendeUhrzeit,
        vorgefundenerSachverhalt: data.vorgefundenerSachverhalt,
        durchgefuehrteArbeiten: data.durchgefuehrteArbeiten,
        completed: false,
      };
      setEntries([...entries, newEntry]);
    }
    setIsModalOpen(false);
  };

  const handleEdit = (entry: BereitschaftEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
    setSelectedEntry(null);
  };

  const handleComplete = (id: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, completed: true } : entry
    ));
  };

  const todoEntries = entries.filter(e => !e.completed);
  const completedEntries = entries.filter(e => e.completed);

  return (
    <div className={styles.bereitschaftContainer}>
      <div className={styles.actionButtons}>
        <button 
          className={`${styles.actionButton} ${styles.clockInButton} ${isClockedIn ? styles.clockedIn : ''}`}
          onClick={() => {
            const newState = !isClockedIn;
            setIsClockedIn(newState);
            if (newState) {
              addLog('Eingestempelt', `Arbeit begonnen um ${new Date().toLocaleTimeString('de-DE')}`, 'time');
            } else {
              addLog('Ausgestempelt', `Arbeit beendet um ${new Date().toLocaleTimeString('de-DE')} | Dauer: ${formatTime(workTimeSeconds)}`, 'time');
              setWorkTimeSeconds(0);
            }
          }}
        >
          {isClockedIn ? 'Ausstempeln' : 'Einstempeln'}
        </button>
        <button 
          className={`${styles.actionButton} ${styles.startTourButton}`}
          disabled={!isClockedIn}
          onClick={() => {
            const newState = !tourStarted;
            setTourStarted(newState);
            if (newState) {
              addLog('Tour gestartet', `Tour begonnen um ${new Date().toLocaleTimeString('de-DE')}`, 'time');
            } else {
              addLog('Tour beendet', `Tour beendet um ${new Date().toLocaleTimeString('de-DE')}`, 'time');
            }
          }}
        >
          {tourStarted ? 'Tour beenden' : 'Tour starten'}
        </button>
      </div>

      {isClockedIn && (
        <div 
          className={styles.workTimeTracker}
          onClick={onNavigateToProfile}
        >
          <div className={styles.workTimeContent}>
            <Clock className={styles.workTimeIcon} size={18} />
            <div className={styles.workTimeInfo}>
              <div className={styles.workTimeLabel}>Arbeitszeit heute</div>
              <div className={styles.workTimeValue}>{formatTime(workTimeSeconds)}</div>
            </div>
          </div>
          <div className={styles.workTimeTarget}>
            Soll: {targetHoursPerDay}:00:00
          </div>
        </div>
      )}

      {/* Compact Map */}
      <div className={styles.compactMapContainer}>
        <MapTab orders={[]} compact />
      </div>

      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterTab} ${
            activeTab === 'todo' ? styles.filterTabActive : ''
          }`}
          onClick={() => setActiveTab('todo')}
        >
          ToDo
          <span className={styles.filterTabBadge}>{todoEntries.length}</span>
        </button>
        <button
          className={`${styles.filterTab} ${
            activeTab === 'completed' ? styles.filterTabActive : ''
          }`}
          onClick={() => setActiveTab('completed')}
        >
          Erledigt
          <span className={styles.filterTabBadge}>{completedEntries.length}</span>
        </button>
      </div>

      {activeTab === 'todo' ? (
        <div className={styles.content}>
          <button 
            className={styles.createButton}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={24} />
            Auftrag anlegen
          </button>

          {todoEntries.length > 0 && (
            <div className={styles.entriesList}>
              {todoEntries.map(entry => (
                <div key={entry.id} className={styles.entryCard} onClick={() => setSelectedEntry(entry)}>
                  <button 
                    className={styles.detailButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEntry(entry);
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className={styles.entryHeader}>
                    <MapPin size={16} className={styles.entryIcon} />
                    <div className={styles.entryLocation}>Einsatzort</div>
                  </div>
                  <div className={styles.entryDetails}>
                    <div className={styles.entryMeta}>
                      <MapPin size={14} className={styles.metaIcon} />
                      <span className={styles.metaLabel}>Straße:</span>
                      <span className={styles.metaValue}>{entry.strasse}</span>
                    </div>
                    <div className={styles.entryMeta}>
                      <MapPin size={14} className={styles.metaIcon} />
                      <span className={styles.metaLabel}>PLZ:</span>
                      <span className={styles.metaValue}>{entry.plz}</span>
                    </div>
                    <div className={styles.entryMeta}>
                      <MapPin size={14} className={styles.metaIcon} />
                      <span className={styles.metaLabel}>Ort:</span>
                      <span className={styles.metaValue}>{entry.ort}</span>
                    </div>
                    <div className={styles.entryMeta}>
                      <Clock size={14} className={styles.metaIcon} />
                      <span className={styles.metaLabel}>Auftragsannahme:</span>
                      <span className={styles.metaValue}>
                        {new Date(entry.date).toLocaleDateString('de-DE')} um {entry.auftragsannahmeUhrzeit}
                      </span>
                    </div>
                    {entry.auftraggeber && (
                      <div className={styles.entryMeta}>
                        <FileText size={14} className={styles.metaIcon} />
                        <span className={styles.metaLabel}>Auftraggeber:</span>
                        <span className={styles.metaValue}>{entry.auftraggeber}</span>
                      </div>
                    )}
                  </div>
                  <button 
                    className={styles.completeEntryButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComplete(entry.id);
                    }}
                  >
                    Erledigt
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <FileText className={styles.infoIcon} size={20} />
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Bereitschafts-Aufträge</h3>
                <p className={styles.infoText}>
                  Dokumentieren Sie Ihre Bereitschaftszeiten und erfassen Sie spontane Einsätze.
                </p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <MapPin className={styles.infoIcon} size={20} />
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Einsatzorte</h3>
                <p className={styles.infoText}>
                  Geben Sie den Einsatzort an und dokumentieren Sie alle relevanten Details.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.completedContent}>
          {completedEntries.length === 0 ? (
            <div className={styles.emptyState}>
              <CheckCircle className={styles.emptyIcon} />
              <p className={styles.emptyText}>Noch keine erledigten Bereitschafts-Aufträge</p>
            </div>
          ) : (
            <div className={styles.entriesList}>
              {completedEntries.map(entry => (
                <div key={entry.id} className={styles.entryCardCompleted} onClick={() => setSelectedEntry(entry)}>
                  <button 
                    className={styles.detailButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEntry(entry);
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className={styles.entryHeader}>
                    <MapPin size={16} className={styles.entryIcon} />
                    <div className={styles.entryLocation}>Einsatzort</div>
                  </div>
                  <div className={styles.entryDetails}>
                    <div className={styles.entryMeta}>
                      <MapPin size={14} className={styles.metaIcon} />
                      <span className={styles.metaLabel}>Straße:</span>
                      <span className={styles.metaValue}>{entry.strasse}</span>
                    </div>
                    <div className={styles.entryMeta}>
                      <MapPin size={14} className={styles.metaIcon} />
                      <span className={styles.metaLabel}>PLZ:</span>
                      <span className={styles.metaValue}>{entry.plz}</span>
                    </div>
                    <div className={styles.entryMeta}>
                      <MapPin size={14} className={styles.metaIcon} />
                      <span className={styles.metaLabel}>Ort:</span>
                      <span className={styles.metaValue}>{entry.ort}</span>
                    </div>
                    <div className={styles.entryMeta}>
                      <Clock size={14} className={styles.metaIcon} />
                      <span className={styles.metaLabel}>Auftragsannahme:</span>
                      <span className={styles.metaValue}>
                        {new Date(entry.date).toLocaleDateString('de-DE')} um {entry.auftragsannahmeUhrzeit}
                      </span>
                    </div>
                    {entry.auftraggeber && (
                      <div className={styles.entryMeta}>
                        <FileText size={14} className={styles.metaIcon} />
                        <span className={styles.metaLabel}>Auftraggeber:</span>
                        <span className={styles.metaValue}>{entry.auftraggeber}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.completedBadge}>
                    <CheckCircle size={14} />
                    Erledigt
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <BereitschaftModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          entry={editingEntry}
        />
      )}

      {selectedEntry && (
        <BereitschaftDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}