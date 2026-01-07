import { Clock, MapPin, MessageSquare, FileUp, Map } from 'lucide-react';
import { useState } from 'react';
import { useOrderUploads } from '../../../contexts/OrderUploadsContext';
import { SketchModal } from './SketchModal';
import { DocumentUploadModal } from './DocumentUploadModal';
import { MessageModal } from './MessageModal';
import type { OrderDto } from '../types';
import styles from './OrderCard.module.scss';

interface OrderCardProps {
  order: OrderDto;
  orderIndex: number;
  isLastOrder: boolean;
  onClick?: (order: OrderDto) => void;
  onMessageClick?: (orderId: string) => void;
}

export function OrderCard({ 
  order, 
  orderIndex,
  isLastOrder,
  onClick, 
  onMessageClick
}: OrderCardProps): JSX.Element {
  const [showSketchModal, setShowSketchModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const { getDocuments, getSketch, completeOrder, isOrderCompleted, canCompleteOrder } = useOrderUploads();

  const documentCount = getDocuments(order.id).length;
  const hasSketch = !!getSketch(order.id);
  const isCompleted = isOrderCompleted(order.id);
  const isAufsteller = order.actionType === 'aufsteller';
  const canComplete = isAufsteller && canCompleteOrder(order.id, order.isZone);

  const handleClick = (e: React.MouseEvent): void => {
    // Prevent card click when clicking action buttons
    if ((e.target as HTMLElement).closest(`.${styles.actions}`)) {
      return;
    }
    onClick?.(order);
  };

  const handleMessageClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setShowMessageModal(true);
  };

  const handleDocumentClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setShowDocumentModal(true);
  };

  const handleSketchClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setShowSketchModal(true);
  };

  const formatTime = (date: string): string => {
    return new Date(date).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getJobTypeLabel = (): string => {
    switch (order.jobType) {
      case 'no-parking-zone':
        return 'Halteverbot';
      case 'road-closure':
        return 'Straßensperrung';
      case 'traffic-safety':
        return 'Verkehrssicherung';
      case 'construction-site':
        return 'Baustelleneinrichtung';
      default:
        return order.jobType;
    }
  };

  const getActionTypeClass = (): string => {
    return order.actionType === 'aufsteller' ? styles.tagAufsteller : styles.tagAbholer;
  };

  const getActionTypeLabel = (): string => {
    return order.actionType === 'aufsteller' ? 'Aufsteller' : 'Abholer';
  };
  
  const getCardClass = (): string => {
    return order.actionType === 'aufsteller' ? styles.cardAufsteller : styles.cardAbholer;
  };
  
  const getBadgeClass = (): string => {
    return order.actionType === 'aufsteller' ? styles.badgeAufsteller : styles.badgeAbholer;
  };
  
  const getIndicatorClass = (): string => {
    return order.actionType === 'aufsteller' ? styles.indicatorAufsteller : styles.indicatorAbholer;
  };

  return (
    <>
      <div className={styles.cardWrapper}>
        <div className={styles.timelineNumber}>{orderIndex + 1}</div>
        {!isLastOrder && <div className={styles.timelineConnector} />}
        
        <div className={`${styles.orderCard} ${getCardClass()}`} onClick={handleClick}>
          <div className={styles.header}>
            <span className={styles.orderNumber}>{order.orderNumber}</span>
            <div className={styles.timeInfo}>
              <Clock size={14} />
              <span>{formatTime(order.scheduledDate)}</span>
            </div>
          </div>

          <div className={styles.jobTypeRow}>
            <div className={styles.jobType}>
              <span className={styles.jobTypeIcon}>🚧</span>
              <span>{getJobTypeLabel()}</span>
            </div>
            <span className={`${styles.actionTag} ${getActionTypeClass()}`}>
              {getActionTypeLabel()}
            </span>
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

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button 
              className={`${styles.actionButton} ${hasSketch ? styles.hasContent : ''}`} 
              onClick={handleSketchClick}
            >
              <Map size={16} />
              <span>Skizze</span>
              {hasSketch && <div className={getIndicatorClass()} />}
            </button>
            <button className={styles.actionButton} onClick={handleMessageClick}>
              <MessageSquare size={16} />
              <span>Nachricht</span>
            </button>
            <button 
              className={`${styles.actionButton} ${documentCount > 0 ? styles.hasContent : ''}`} 
              onClick={handleDocumentClick}
            >
              <FileUp size={16} />
              <span>Dokument</span>
              {documentCount > 0 && (
                <div className={getBadgeClass()}>{documentCount}</div>
              )}
            </button>
          </div>

          {/* Complete Button - always visible for Aufsteller, disabled until all requirements met */}
          {isAufsteller && !isCompleted && (
            <button 
              className={`${styles.completeButton} ${!canComplete ? styles.completeButtonDisabled : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (canComplete) {
                  completeOrder(order.id);
                }
              }}
              disabled={!canComplete}
            >
              Als erledigt markieren
            </button>
          )}
        </div>
      </div>

      {showSketchModal && (
        <SketchModal orderId={order.id} onClose={() => setShowSketchModal(false)} />
      )}

      {showDocumentModal && (
        <DocumentUploadModal orderId={order.id} onClose={() => setShowDocumentModal(false)} />
      )}

      {showMessageModal && (
        <MessageModal orderId={order.id} onClose={() => setShowMessageModal(false)} />
      )}
    </>
  );
}