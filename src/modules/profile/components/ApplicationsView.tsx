import { useState } from 'react';
import { FileText, Send, Plane, Coins, FileCheck, Plus, Calendar } from 'lucide-react';
import styles from './ApplicationsView.module.scss';

interface Application {
  id: string;
  type: 'vacation' | 'expenses' | 'advance' | 'document';
  title: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  amount?: string;
}

type ApplicationType = 'vacation' | 'expenses' | 'advance' | 'document';

export function ApplicationsView(): JSX.Element {
  const [showNewApplicationForm, setShowNewApplicationForm] = useState(false);
  const [selectedType, setSelectedType] = useState<ApplicationType>('vacation');

  const applications: Application[] = [
    {
      id: '1',
      type: 'vacation',
      title: 'Urlaubsantrag',
      date: '15.12.2025 - 22.12.2025',
      status: 'approved'
    },
    {
      id: '2',
      type: 'expenses',
      title: 'Reisekosten Dezember',
      date: '20.12.2025',
      status: 'pending',
      amount: '142,50€'
    },
    {
      id: '3',
      type: 'advance',
      title: 'Vorschuss Material',
      date: '10.12.2025',
      status: 'approved',
      amount: '200,00€'
    },
    {
      id: '4',
      type: 'vacation',
      title: 'Urlaubsantrag',
      date: '05.11.2025 - 08.11.2025',
      status: 'approved'
    }
  ];

  const getStatusColor = (status: Application['status']): string => {
    switch (status) {
      case 'pending': return '#eab308';
      case 'approved': return '#22c55e';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: Application['status']): string => {
    switch (status) {
      case 'pending': return 'In Bearbeitung';
      case 'approved': return 'Genehmigt';
      case 'rejected': return 'Abgelehnt';
      default: return 'Unbekannt';
    }
  };

  const getTypeIcon = (type: Application['type']) => {
    const props = { size: 20 };
    switch (type) {
      case 'vacation': return <Plane {...props} />;
      case 'expenses': return <Coins {...props} />;
      case 'advance': return <Coins {...props} />;
      case 'document': return <FileCheck {...props} />;
      default: return <FileText {...props} />;
    }
  };

  const applicationTypes = [
    { id: 'vacation', label: 'Urlaub', icon: <Plane size={20} /> },
    { id: 'expenses', label: 'Reisekosten', icon: <Coins size={20} /> },
    { id: 'advance', label: 'Vorschuss', icon: <Coins size={20} /> },
    { id: 'document', label: 'Dokument', icon: <FileCheck size={20} /> }
  ];

  return (
    <div className={styles.applicationsContainer}>
      {!showNewApplicationForm ? (
        <>
          <div className={styles.applicationsHeader}>
            <div className={styles.headerContent}>
              <h2 className={styles.applicationsTitle}>Meine Anträge</h2>
              <p className={styles.applicationsSubtitle}>
                Übersicht aller eingereichten Anträge
              </p>
            </div>
            <button 
              className={styles.newApplicationButton}
              onClick={() => setShowNewApplicationForm(true)}
            >
              <Plus size={20} />
              Neuer Antrag
            </button>
          </div>

          <div className={styles.applicationsList}>
            {applications.map((application) => (
              <div key={application.id} className={styles.applicationCard}>
                <div className={styles.applicationIcon}>
                  {getTypeIcon(application.type)}
                </div>
                <div className={styles.applicationContent}>
                  <h3 className={styles.applicationTitle}>{application.title}</h3>
                  <div className={styles.applicationMeta}>
                    <span className={styles.applicationDate}>
                      <Calendar size={14} />
                      {application.date}
                    </span>
                    {application.amount && (
                      <span className={styles.applicationAmount}>{application.amount}</span>
                    )}
                  </div>
                </div>
                <div 
                  className={styles.applicationStatus}
                  style={{ backgroundColor: getStatusColor(application.status) }}
                >
                  {getStatusLabel(application.status)}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.newApplicationForm}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Neuer Antrag</h2>
            <button 
              className={styles.closeButton}
              onClick={() => setShowNewApplicationForm(false)}
            >
              Abbrechen
            </button>
          </div>

          <div className={styles.typeSelector}>
            {applicationTypes.map((type) => (
              <button
                key={type.id}
                className={`${styles.typeButton} ${
                  selectedType === type.id ? styles.typeButtonActive : ''
                }`}
                onClick={() => setSelectedType(type.id as ApplicationType)}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
          </div>

          <div className={styles.formFields}>
            {selectedType === 'vacation' && (
              <>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Von</label>
                  <input type="date" className={styles.fieldInput} />
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Bis</label>
                  <input type="date" className={styles.fieldInput} />
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Anmerkung (optional)</label>
                  <textarea className={styles.fieldTextarea} rows={3} />
                </div>
              </>
            )}

            {(selectedType === 'expenses' || selectedType === 'advance') && (
              <>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Betrag (€)</label>
                  <input type="number" step="0.01" className={styles.fieldInput} />
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Beschreibung</label>
                  <textarea className={styles.fieldTextarea} rows={3} />
                </div>
              </>
            )}

            {selectedType === 'document' && (
              <>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Titel</label>
                  <input type="text" className={styles.fieldInput} />
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Beschreibung</label>
                  <textarea className={styles.fieldTextarea} rows={3} />
                </div>
              </>
            )}
          </div>

          <button className={styles.submitButton}>
            <Send size={20} />
            Antrag einreichen
          </button>
        </div>
      )}
    </div>
  );
}
