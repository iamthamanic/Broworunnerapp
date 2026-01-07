import { Clock, MapPin, MessageSquare, FileUp, LucideIcon } from 'lucide-react';
import { useOrderCardActions } from '../hooks/useOrderCardActions';
import { DocumentUploadModal } from './DocumentUploadModal';
import { MessageModal } from './MessageModal';
import type { OrderDto } from '../types';
import styles from './UniversalOrderCard.module.scss';

export type OrderCardVariant = 'halteverbot' | 'baustelle' | 'kontrollfahrt';

interface OrderCardConfig {
  variant: OrderCardVariant;
  icon: LucideIcon;
  label: string;
}

interface UniversalOrderCardProps {
  order: OrderDto;
  orderIndex: number;
  isLastOrder: boolean;
  config: OrderCardConfig;
  onClick?: (order: OrderDto) => void;
}

export function UniversalOrderCard({ 
  order, 
  orderIndex,
  isLastOrder,
  config,
  onClick
}: UniversalOrderCardProps): JSX.Element {
  const {
    showDocumentModal,
    showMessageModal,
    documentCount,
    isCompleted,
    setShowDocumentModal,
    setShowMessageModal,
    handleMessageClick,
    handleDocumentClick,
    handleCompleteOrder,
  } = useOrderCardActions(order.id);

  const handleClick = (e: React.MouseEvent): void => {
    if ((e.target as HTMLElement).closest(`.${styles.actions}`)) {
      return;
    }
    onClick?.(order);
  };

  const formatTime = (date: string): string => {
    return new Date(date).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const Icon = config.icon;

  return (
    <>
      <div className={styles.cardWrapper}>
        <div className={`${styles.timelineNumber} ${styles[`variant-${config.variant}`]}`}>
          {orderIndex + 1}
        </div>
        {!isLastOrder && (
          <div className={`${styles.timelineConnector} ${styles[`variant-${config.variant}`]}`} />
        )}
        
        <div 
          className={`${styles.orderCard} ${styles[`variant-${config.variant}`]} ${
            isCompleted ? styles.cardCompleted : ''
          }`}
          onClick={handleClick}
        >
          <div className={styles.header}>
            <span className={styles.orderNumber}>{order.orderNumber}</span>
            <div className={styles.timeInfo}>
              <Clock size={14} />
              <span>{formatTime(order.scheduledDate)}</span>
            </div>
          </div>

          <div className={styles.jobTypeRow}>
            <div className={`${styles.jobType} ${styles[`variant-${config.variant}`]}`}>
              <Icon size={16} className={styles.jobTypeIcon} />
              <span>{config.label}</span>
            </div>
          </div>

          <div className={styles.location}>
            <div className={styles.locationText}>
              <MapPin size={14} />
              {order.location.street} {order.location.number}
            </div>
            <div className={styles.locationAddress}>
              {order.location.postalCode} {order.location.city}
            </div>
          </div>

          <p className={styles.description}>{order.description}</p>

          {order.notes && (
            <div className={`${styles.notes} ${styles[`variant-${config.variant}`]}`}>
              <strong>Hinweise:</strong> {order.notes}
            </div>
          )}

          <div className={styles.actions}>
            <button 
              className={`${styles.actionButton} ${styles[`variant-${config.variant}`]}`}
              onClick={handleMessageClick}
            >
              <MessageSquare size={16} />
              <span>Nachricht</span>
            </button>

            <button 
              className={`${styles.actionButton} ${styles[`variant-${config.variant}`]}`}
              onClick={handleDocumentClick}
            >
              <FileUp size={16} />
              <span>Dokumente</span>
              {documentCount > 0 && (
                <span className={styles.badgeDocs}>{documentCount}</span>
              )}
            </button>

            <button 
              className={`${styles.completeButton} ${styles[`variant-${config.variant}`]}`}
              onClick={(e) => handleCompleteOrder(e, order.id)}
              disabled={isCompleted}
            >
              {isCompleted ? '✓ Erledigt' : 'Erledigt'}
            </button>
          </div>

          {isCompleted && (
            <div className={styles.completedBadge}>
              ✓ Erledigt
            </div>
          )}
        </div>
      </div>

      {showDocumentModal && (
        <DocumentUploadModal 
          orderId={order.id}
          onClose={() => setShowDocumentModal(false)}
        />
      )}

      {showMessageModal && (
        <MessageModal
          orderId={order.id}
          orderNumber={order.orderNumber}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </>
  );
}