import { useState } from 'react';
import { Camera, MapPin, Clock, AlertTriangle, CheckCircle, Upload, X } from 'lucide-react';
import { useActivityLog } from '../../../contexts/ActivityLogContext';
import styles from './UnfallmeldenView.module.scss';

type UnfallArt = 'arbeitsunfall' | 'wegeunfall' | 'sachschaden' | 'verkehrsunfall';
type Schweregrad = 'leicht' | 'mittel' | 'schwer';

interface UnfallmeldenViewProps {
  onBack?: () => void;
}

export function UnfallmeldenView({ onBack }: UnfallmeldenViewProps): JSX.Element {
  const { addLog } = useActivityLog();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [unfallArt, setUnfallArt] = useState<UnfallArt>('arbeitsunfall');
  const [schweregrad, setSchweregrad] = useState<Schweregrad>('leicht');
  const [datum, setDatum] = useState(new Date().toISOString().split('T')[0]);
  const [uhrzeit, setUhrzeit] = useState(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
  const [ort, setOrt] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [zeugen, setZeugen] = useState('');
  const [verletzungen, setVerletzungen] = useState('');
  const [erstversorgung, setErstversorgung] = useState(false);
  const [arztbesuch, setArztbesuch] = useState(false);
  const [polizei, setPolizei] = useState(false);
  const [fotos, setFotos] = useState<string[]>([]);

  const handlePhotoUpload = () => {
    // Mock photo upload
    const mockPhoto = `photo-${Date.now()}.jpg`;
    setFotos([...fotos, mockPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const unfallData = {
      unfallArt,
      schweregrad,
      datum,
      uhrzeit,
      ort,
      beschreibung,
      zeugen,
      verletzungen,
      erstversorgung,
      arztbesuch,
      polizei,
      fotoAnzahl: fotos.length,
    };

    addLog(
      'Unfallmeldung eingereicht',
      `${unfallArt} am ${datum} um ${uhrzeit} - ${schweregrad}`,
      'alert'
    );

    console.log('Unfallmeldung:', unfallData);
    setSubmitted(true);
  };

  const isStep1Valid = unfallArt && datum && uhrzeit && ort;
  const isStep2Valid = beschreibung.length >= 20;
  const isStep3Valid = true; // Optional fields

  if (submitted) {
    return (
      <div className={styles.unfallmeldenContainer}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle size={64} />
          </div>
          <h2 className={styles.successTitle}>Unfallmeldung erfolgreich eingereicht</h2>
          <p className={styles.successText}>
            Ihre Unfallmeldung wurde erfolgreich übermittelt und wird von unserem Team bearbeitet.
            Sie erhalten in Kürze eine Bestätigung und weitere Informationen.
          </p>
          <div className={styles.successInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Vorgangsnummer:</span>
              <span className={styles.infoValue}>UNF-{Date.now().toString().slice(-8)}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Status:</span>
              <span className={styles.statusBadge}>In Bearbeitung</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Eingereicht am:</span>
              <span className={styles.infoValue}>
                {new Date().toLocaleDateString('de-DE')} um {new Date().toLocaleTimeString('de-DE')}
              </span>
            </div>
          </div>
          <button className={styles.backButton} onClick={onBack}>
            Zurück zum Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.unfallmeldenContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <AlertTriangle size={24} className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Unfall melden</h1>
            <p className={styles.subtitle}>Bitte füllen Sie das Formular vollständig aus</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className={styles.progressSteps}>
        <div className={`${styles.progressStep} ${step >= 1 ? styles.progressStepActive : ''}`}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepLabel}>Unfalldetails</div>
        </div>
        <div className={styles.progressLine}></div>
        <div className={`${styles.progressStep} ${step >= 2 ? styles.progressStepActive : ''}`}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepLabel}>Beschreibung</div>
        </div>
        <div className={styles.progressLine}></div>
        <div className={`${styles.progressStep} ${step >= 3 ? styles.progressStepActive : ''}`}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepLabel}>Zusatzinfos</div>
        </div>
      </div>

      <div className={styles.formContainer}>
        {/* Step 1: Unfalldetails */}
        {step === 1 && (
          <div className={styles.formStep}>
            <h2 className={styles.stepTitle}>Unfalldetails</h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Art des Unfalls <span className={styles.required}>*</span>
              </label>
              <div className={styles.radioGroup}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="unfallArt"
                    value="arbeitsunfall"
                    checked={unfallArt === 'arbeitsunfall'}
                    onChange={(e) => setUnfallArt(e.target.value as UnfallArt)}
                  />
                  <span>Arbeitsunfall</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="unfallArt"
                    value="wegeunfall"
                    checked={unfallArt === 'wegeunfall'}
                    onChange={(e) => setUnfallArt(e.target.value as UnfallArt)}
                  />
                  <span>Wegeunfall</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="unfallArt"
                    value="sachschaden"
                    checked={unfallArt === 'sachschaden'}
                    onChange={(e) => setUnfallArt(e.target.value as UnfallArt)}
                  />
                  <span>Sachschaden</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="unfallArt"
                    value="verkehrsunfall"
                    checked={unfallArt === 'verkehrsunfall'}
                    onChange={(e) => setUnfallArt(e.target.value as UnfallArt)}
                  />
                  <span>Verkehrsunfall</span>
                </label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Schweregrad <span className={styles.required}>*</span>
              </label>
              <div className={styles.radioGroup}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="schweregrad"
                    value="leicht"
                    checked={schweregrad === 'leicht'}
                    onChange={(e) => setSchweregrad(e.target.value as Schweregrad)}
                  />
                  <span className={styles.schwereleicht}>Leicht</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="schweregrad"
                    value="mittel"
                    checked={schweregrad === 'mittel'}
                    onChange={(e) => setSchweregrad(e.target.value as Schweregrad)}
                  />
                  <span className={styles.schweremittel}>Mittel</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="schweregrad"
                    value="schwer"
                    checked={schweregrad === 'schwer'}
                    onChange={(e) => setSchweregrad(e.target.value as Schweregrad)}
                  />
                  <span className={styles.schwereschwer}>Schwer</span>
                </label>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Clock size={16} />
                  Datum <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  className={styles.input}
                  value={datum}
                  onChange={(e) => setDatum(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Clock size={16} />
                  Uhrzeit <span className={styles.required}>*</span>
                </label>
                <input
                  type="time"
                  className={styles.input}
                  value={uhrzeit}
                  onChange={(e) => setUhrzeit(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <MapPin size={16} />
                Unfallort <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="z.B. Musterstraße 123, 12345 Musterstadt"
                value={ort}
                onChange={(e) => setOrt(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Beschreibung */}
        {step === 2 && (
          <div className={styles.formStep}>
            <h2 className={styles.stepTitle}>Unfallbeschreibung</h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Unfallhergang <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textarea}
                placeholder="Bitte beschreiben Sie detailliert, wie der Unfall passiert ist..."
                value={beschreibung}
                onChange={(e) => setBeschreibung(e.target.value)}
                rows={6}
              />
              <div className={styles.charCount}>
                {beschreibung.length} Zeichen (mindestens 20 erforderlich)
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Zeugen (optional)</label>
              <textarea
                className={styles.textarea}
                placeholder="Namen und Kontaktdaten von Zeugen..."
                value={zeugen}
                onChange={(e) => setZeugen(e.target.value)}
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Verletzungen (optional)</label>
              <textarea
                className={styles.textarea}
                placeholder="Beschreiben Sie eventuelle Verletzungen..."
                value={verletzungen}
                onChange={(e) => setVerletzungen(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 3: Zusatzinfos */}
        {step === 3 && (
          <div className={styles.formStep}>
            <h2 className={styles.stepTitle}>Zusätzliche Informationen</h2>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={erstversorgung}
                  onChange={(e) => setErstversorgung(e.target.checked)}
                />
                <span>Erstversorgung vor Ort durchgeführt</span>
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={arztbesuch}
                  onChange={(e) => setArztbesuch(e.target.checked)}
                />
                <span>Arzt wurde aufgesucht / Rettungsdienst alarmiert</span>
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={polizei}
                  onChange={(e) => setPolizei(e.target.checked)}
                />
                <span>Polizei wurde informiert</span>
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Camera size={16} />
                Fotos hochladen (optional)
              </label>
              <div className={styles.photoGrid}>
                {fotos.map((photo, index) => (
                  <div key={index} className={styles.photoItem}>
                    <div className={styles.photoPlaceholder}>
                      <Camera size={24} />
                    </div>
                    <button
                      className={styles.removePhotoButton}
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <X size={16} />
                    </button>
                    <div className={styles.photoName}>{photo}</div>
                  </div>
                ))}
                <button className={styles.uploadButton} onClick={handlePhotoUpload}>
                  <Upload size={24} />
                  <span>Foto hinzufügen</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>
        {step > 1 && (
          <button className={styles.backBtn} onClick={() => setStep(step - 1)}>
            Zurück
          </button>
        )}
        {step < 3 ? (
          <button
            className={styles.nextBtn}
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 1 && !isStep1Valid) ||
              (step === 2 && !isStep2Valid)
            }
          >
            Weiter
          </button>
        ) : (
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
          >
            Meldung absenden
          </button>
        )}
      </div>
    </div>
  );
}
