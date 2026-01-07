import { useState } from 'react';
import { X, MapPin, Calendar, Clock, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './BereitschaftModal.module.scss';

interface CheckboxItem {
  label: string;
  checked: boolean;
  note: string;
}

interface BereitschaftData {
  auftraggeber: string;
  strasse: string;
  plz: string;
  ort: string;
  auftragsannahmeDatum: string;
  auftragsannahmeUhrzeit: string;
  ankunftUhrzeit: string;
  arbeitsbeginnUhrzeit: string;
  arbeitsendeUhrzeit: string;
  vorgefundenerSachverhalt: CheckboxItem[];
  durchgefuehrteArbeiten: CheckboxItem[];
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

interface BereitschaftModalProps {
  onClose: () => void;
  onSubmit: (data: BereitschaftData) => void;
  entry?: BereitschaftEntry | null;
}

export function BereitschaftModal({ onClose, onSubmit, entry }: BereitschaftModalProps): JSX.Element {
  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const [formData, setFormData] = useState<BereitschaftData>({
    auftraggeber: entry?.auftraggeber || '',
    strasse: entry?.strasse || '',
    plz: entry?.plz || '',
    ort: entry?.ort || '',
    auftragsannahmeDatum: entry?.date || new Date().toISOString().split('T')[0],
    auftragsannahmeUhrzeit: entry?.auftragsannahmeUhrzeit || getCurrentTime(),
    ankunftUhrzeit: entry?.ankunftUhrzeit || '',
    arbeitsbeginnUhrzeit: entry?.arbeitsbeginnUhrzeit || '',
    arbeitsendeUhrzeit: entry?.arbeitsendeUhrzeit || '',
    vorgefundenerSachverhalt: entry?.vorgefundenerSachverhalt || [
      { label: 'Unfallstelle', checked: false, note: '' },
      { label: 'Baustelle', checked: false, note: '' },
      { label: 'Straßenschaden', checked: false, note: '' },
      { label: 'Sonstiges', checked: false, note: '' },
    ],
    durchgefuehrteArbeiten: entry?.durchgefuehrteArbeiten || [
      { label: 'Absicherung aufgebaut', checked: false, note: '' },
      { label: 'Verkehrsregelung', checked: false, note: '' },
      { label: 'Dokumentation', checked: false, note: '' },
      { label: 'Sonstiges', checked: false, note: '' },
    ],
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];
    if (!formData.auftraggeber) {
      newErrors.push('Auftraggeber ist erforderlich.');
    }
    if (!formData.strasse) {
      newErrors.push('Straße ist erforderlich.');
    }
    if (!formData.plz) {
      newErrors.push('PLZ ist erforderlich.');
    }
    if (!formData.ort) {
      newErrors.push('Ort ist erforderlich.');
    }
    if (!formData.auftragsannahmeDatum) {
      newErrors.push('Auftragsannahme-Datum ist erforderlich.');
    }
    if (!formData.auftragsannahmeUhrzeit) {
      newErrors.push('Auftragsannahme-Uhrzeit ist erforderlich.');
    }
    if (!formData.ankunftUhrzeit) {
      newErrors.push('Ankunft-Uhrzeit ist erforderlich.');
    }
    if (!formData.arbeitsbeginnUhrzeit) {
      newErrors.push('Arbeitsbeginn-Uhrzeit ist erforderlich.');
    }
    if (!formData.arbeitsendeUhrzeit) {
      newErrors.push('Arbeitsende-Uhrzeit ist erforderlich.');
    }
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (field: keyof BereitschaftData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: 'vorgefundenerSachverhalt' | 'durchgefuehrteArbeiten', index: number, checked: boolean) => {
    setFormData(prev => {
      const newItems = [...prev[field]];
      newItems[index].checked = checked;
      return { ...prev, [field]: newItems };
    });
  };

  const handleCheckboxNoteChange = (field: 'vorgefundenerSachverhalt' | 'durchgefuehrteArbeiten', index: number, note: string) => {
    setFormData(prev => {
      const newItems = [...prev[field]];
      newItems[index].note = note;
      return { ...prev, [field]: newItems };
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {entry ? 'Bereitschafts-Auftrag bearbeiten' : 'Bereitschafts-Auftrag anlegen'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.length > 0 && (
            <div className={styles.errorBox}>
              {errors.map((error, idx) => (
                <div key={idx} className={styles.errorMessage}>{error}</div>
              ))}
            </div>
          )}

          {/* Auftraggeber Dropdown */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FileText size={16} />
              Auftraggeber *
            </label>
            <select
              className={styles.select}
              value={formData.auftraggeber}
              onChange={(e) => handleChange('auftraggeber', e.target.value)}
              required
            >
              <option value="">Bitte wählen...</option>
              <option value="Polizei">Polizei</option>
              <option value="BWB">BWB</option>
            </select>
          </div>

          {/* Einsatzort */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <MapPin size={16} />
                Straße *
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="Straße, Nr."
                value={formData.strasse}
                onChange={(e) => handleChange('strasse', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <MapPin size={16} />
                PLZ *
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="PLZ"
                value={formData.plz}
                onChange={(e) => handleChange('plz', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <MapPin size={16} />
                Ort *
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="Ort"
                value={formData.ort}
                onChange={(e) => handleChange('ort', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Auftragsannahme Datum + Uhrzeit */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Calendar size={16} />
                Auftragsannahme Datum *
              </label>
              <input
                type="date"
                className={styles.input}
                value={formData.auftragsannahmeDatum}
                onChange={(e) => handleChange('auftragsannahmeDatum', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Clock size={16} />
                Auftragsannahme Uhrzeit *
              </label>
              <input
                type="time"
                className={styles.input}
                value={formData.auftragsannahmeUhrzeit}
                onChange={(e) => handleChange('auftragsannahmeUhrzeit', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Ankunft am Auftragsort Uhrzeit */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Clock size={16} />
              Ankunft am Auftragsort Uhrzeit *
            </label>
            <input
              type="time"
              className={styles.input}
              value={formData.ankunftUhrzeit}
              onChange={(e) => handleChange('ankunftUhrzeit', e.target.value)}
              required
            />
          </div>

          {/* Arbeitsbeginn + Arbeitsende Uhrzeit */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Clock size={16} />
                Arbeitsbeginn Uhrzeit *
              </label>
              <input
                type="time"
                className={styles.input}
                value={formData.arbeitsbeginnUhrzeit}
                onChange={(e) => handleChange('arbeitsbeginnUhrzeit', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Clock size={16} />
                Arbeitsende Uhrzeit *
              </label>
              <input
                type="time"
                className={styles.input}
                value={formData.arbeitsendeUhrzeit}
                onChange={(e) => handleChange('arbeitsendeUhrzeit', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Vorgefundener Sachverhalt */}
          <div className={styles.checkboxSection}>
            <h3 className={styles.sectionTitle}>Vorgefundener Sachverhalt</h3>
            {formData.vorgefundenerSachverhalt.map((item, index) => (
              <div key={index} className={styles.checkboxWrapper}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={item.checked}
                    onChange={(e) => handleCheckboxChange('vorgefundenerSachverhalt', index, e.target.checked)}
                  />
                  <span>{item.label}</span>
                </label>
                {item.checked && (
                  <textarea
                    className={styles.checkboxNote}
                    placeholder="Notiz hinzufügen..."
                    value={item.note}
                    onChange={(e) => handleCheckboxNoteChange('vorgefundenerSachverhalt', index, e.target.value)}
                    rows={2}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Durchgeführte Arbeiten */}
          <div className={styles.checkboxSection}>
            <h3 className={styles.sectionTitle}>Durchgeführte Arbeiten</h3>
            {formData.durchgefuehrteArbeiten.map((item, index) => (
              <div key={index} className={styles.checkboxWrapper}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={item.checked}
                    onChange={(e) => handleCheckboxChange('durchgefuehrteArbeiten', index, e.target.checked)}
                  />
                  <span>{item.label}</span>
                </label>
                {item.checked && (
                  <textarea
                    className={styles.checkboxNote}
                    placeholder="Notiz hinzufügen..."
                    value={item.note}
                    onChange={(e) => handleCheckboxNoteChange('durchgefuehrteArbeiten', index, e.target.value)}
                    rows={2}
                  />
                )}
              </div>
            ))}
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Abbrechen
            </button>
            <button type="submit" className={styles.submitButton}>
              {entry ? 'Änderungen speichern' : 'Auftrag erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}