import { X, MessageSquare } from 'lucide-react';
import styles from './MessageModal.module.scss';

interface MessageModalProps {
  orderId: string;
  onClose: () => void;
}

export function MessageModal({ orderId, onClose }: MessageModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Nachricht - Auftrag #{orderId}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.comingSoon}>
            <MessageSquare size={64} />
            <h3>Chat-Feature kommt bald!</h3>
            <p>Diese Funktion wird in einem zukünftigen Update verfügbar sein.</p>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.closeFooterButton} onClick={onClose}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
