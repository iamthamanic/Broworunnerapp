import { X, MapPin, Calendar, Clock, FileText, CheckCircle, Edit } from 'lucide-react';
import styles from './BereitschaftDetailModal.module.scss';

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

interface BereitschaftDetailModalProps {
  entry: BereitschaftEntry;
  onClose: () => void;
  onEdit: (entry: BereitschaftEntry) => void;
}

export function BereitschaftDetailModal({ entry, onClose, onEdit }: BereitschaftDetailModalProps): JSX.Element {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Bereitschafts-Protokoll</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Auftraggeber */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FileText size={18} className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Auftraggeber</h3>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.badge}>{entry.auftraggeber}</div>
            </div>
          </div>

          {/* Einsatzort */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <MapPin size={18} className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Einsatzort</h3>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.addressLine}>
                <span className={styles.addressLabel}>Straße:</span>
                <span className={styles.addressValue}>{entry.strasse}</span>
              </div>
              <div className={styles.addressLine}>
                <span className={styles.addressLabel}>PLZ:</span>
                <span className={styles.addressValue}>{entry.plz}</span>
              </div>
              <div className={styles.addressLine}>
                <span className={styles.addressLabel}>Ort:</span>
                <span className={styles.addressValue}>{entry.ort}</span>
              </div>
            </div>
          </div>

          {/* Zeiterfassung */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Clock size={18} className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Zeiterfassung</h3>
            </div>
            <div className={styles.timelineGrid}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineLabel}>Auftragsannahme</div>
                <div className={styles.timelineValue}>
                  {new Date(entry.date).toLocaleDateString('de-DE')} • {entry.auftragsannahmeUhrzeit}
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineLabel}>Ankunft am Auftragsort</div>
                <div className={styles.timelineValue}>{entry.ankunftUhrzeit}</div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineLabel}>Arbeitsbeginn</div>
                <div className={styles.timelineValue}>{entry.arbeitsbeginnUhrzeit}</div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineLabel}>Arbeitsende</div>
                <div className={styles.timelineValue}>{entry.arbeitsendeUhrzeit}</div>
              </div>
            </div>
          </div>

          {/* Vorgefundener Sachverhalt */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FileText size={18} className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Vorgefundener Sachverhalt</h3>
            </div>
            <div className={styles.checklistContent}>
              {entry.vorgefundenerSachverhalt.map((item, index) => (
                item.checked && (
                  <div key={index} className={styles.checklistItem}>
                    <div className={styles.checklistHeader}>
                      <CheckCircle size={16} className={styles.checkIcon} />
                      <span className={styles.checklistLabel}>{item.label}</span>
                    </div>
                    {item.note && (
                      <div className={styles.checklistNote}>{item.note}</div>
                    )}
                  </div>
                )
              ))}
              {entry.vorgefundenerSachverhalt.every(item => !item.checked) && (
                <p className={styles.emptyText}>Keine Angaben</p>
              )}
            </div>
          </div>

          {/* Durchgeführte Arbeiten */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FileText size={18} className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Durchgeführte Arbeiten</h3>
            </div>
            <div className={styles.checklistContent}>
              {entry.durchgefuehrteArbeiten.map((item, index) => (
                item.checked && (
                  <div key={index} className={styles.checklistItem}>
                    <div className={styles.checklistHeader}>
                      <CheckCircle size={16} className={styles.checkIcon} />
                      <span className={styles.checklistLabel}>{item.label}</span>
                    </div>
                    {item.note && (
                      <div className={styles.checklistNote}>{item.note}</div>
                    )}
                  </div>
                )
              ))}
              {entry.durchgefuehrteArbeiten.every(item => !item.checked) && (
                <p className={styles.emptyText}>Keine Angaben</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.editButton} onClick={() => onEdit(entry)}>
            <Edit size={16} />
            Bearbeiten
          </button>
        </div>
      </div>
    </div>
  );
}