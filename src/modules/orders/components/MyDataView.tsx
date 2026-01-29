import { User, Clock, Shield, FileText, MessageSquare, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { LogsView } from '../../profile/components/LogsView';
import styles from './MyDataView.module.scss';

type MyDataSubTab = 'personalakte' | 'logs' | 'berechtigungen' | 'dokumente' | 'nachrichten' | 'feedback';

interface MyDataViewProps {
  onClose?: () => void;
}

export function MyDataView({ onClose }: MyDataViewProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<MyDataSubTab>('personalakte');

  return (
    <div className={styles.myDataContainer}>
      {/* Sub Tabs */}
      <div className={styles.subTabsWrapper}>
        <div className={styles.subTabsRow}>
          <button
            className={`${styles.subTab} ${
              activeTab === 'personalakte' ? styles.subTabActive : ''
            }`}
            onClick={() => setActiveTab('personalakte')}
          >
            <User size={18} />
            <span>Personalakte</span>
          </button>
          <button
            className={`${styles.subTab} ${
              activeTab === 'logs' ? styles.subTabActive : ''
            }`}
            onClick={() => setActiveTab('logs')}
          >
            <Clock size={18} />
            <span>Logs</span>
          </button>
          <button
            className={`${styles.subTab} ${
              activeTab === 'berechtigungen' ? styles.subTabActive : ''
            }`}
            onClick={() => setActiveTab('berechtigungen')}
          >
            <Shield size={18} />
            <span>Berechtigungen</span>
          </button>
          <button
            className={`${styles.subTab} ${
              activeTab === 'dokumente' ? styles.subTabActive : ''
            }`}
            onClick={() => setActiveTab('dokumente')}
          >
            <FileText size={18} />
            <span>Dokumente</span>
          </button>
          <button
            className={`${styles.subTab} ${
              activeTab === 'nachrichten' ? styles.subTabActive : ''
            }`}
            onClick={() => setActiveTab('nachrichten')}
          >
            <MessageSquare size={18} />
            <span>Nachrichten</span>
          </button>
        </div>
        <div className={styles.subTabsRow}>
          <button
            className={`${styles.subTab} ${
              activeTab === 'feedback' ? styles.subTabActive : ''
            }`}
            onClick={() => setActiveTab('feedback')}
          >
            <MessageCircle size={18} />
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'personalakte' && (
          <div className={styles.contentCard}>
            <h2 className={styles.contentTitle}>Personalakte</h2>
            <p className={styles.contentPlaceholder}>Hier werden Ihre persönlichen Daten angezeigt.</p>
          </div>
        )}

        {activeTab === 'logs' && (
          <LogsView />
        )}

        {activeTab === 'berechtigungen' && (
          <div className={styles.contentCard}>
            <h2 className={styles.contentTitle}>Berechtigungen</h2>
            <p className={styles.contentPlaceholder}>Hier werden Ihre Zugriffsrechte angezeigt.</p>
          </div>
        )}

        {activeTab === 'dokumente' && (
          <div className={styles.contentCard}>
            <h2 className={styles.contentTitle}>Dokumente</h2>
            <p className={styles.contentPlaceholder}>Hier werden Ihre Dokumente angezeigt.</p>
          </div>
        )}

        {activeTab === 'nachrichten' && (
          <div className={styles.contentCard}>
            <h2 className={styles.contentTitle}>Nachrichten</h2>
            <p className={styles.contentPlaceholder}>Hier werden Ihre Nachrichten angezeigt.</p>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className={styles.contentCard}>
            <h2 className={styles.contentTitle}>Feedback</h2>
            <p className={styles.contentPlaceholder}>Hier können Sie Feedback geben.</p>
          </div>
        )}
      </div>
    </div>
  );
}