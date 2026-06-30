import { Clock, MapPin, MessageSquare, FileUp, Map } from 'lucide-react';
import { useState } from 'react';
import { useOrderUploads } from '../../../contexts/OrderUploadsContext';
import { SketchModal } from './SketchModal';
import { DocumentUploadModal } from './DocumentUploadModal';
import { MessageModal } from './MessageModal';
import { VerkehrszeichenSign } from './VerkehrszeichenSign';
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
  const isHalteverbot = order.jobType === 'no-parking-zone';
  const primarySign = order.requiredSigns?.[0];

  const handleClick = (e: React.MouseEvent): void => {
    if ((e.target as HTMLElement).closest(`.${styles.actions}`)) return;
    onClick?.(order);
  };

  const formatTime = (date: string): string =>
    new Date(date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  const getJobTypeLabel = (): string => {
    switch (order.jobType) {
      case 'no-parking-zone': return 'Halteverbot';
      case 'road-closure': return 'Straßensperrung';
      case 'traffic-safety': return 'Verkehrssicherung';
      case 'construction-site': return 'Baustelle';
      default: return order.jobType;
    }
  };

  const getCardClass = (): string =>
    order.actionType === 'aufsteller' ? styles.cardAufsteller : styles.cardAbholer;

  const getBadgeClass = (): string =>
    order.actionType === 'aufsteller' ? styles.badgeAufsteller : styles.badgeAbholer;

  const getIndicatorClass = (): string =>
    order.actionType === 'aufsteller' ? styles.indicatorAufsteller : styles.indicatorAbholer;

  const getActionTypeClass = (): string =>
    order.actionType === 'aufsteller' ? styles.tagAufsteller : styles.tagAbholer;

  return (
    <>
      <div className={styles.cardWrapper}>
        <div className={styles.timelineNumber}>{orderIndex + 1}</div>
        {!isLastOrder && <div className={styles.timelineConnector} />}

        <div className={`${styles.orderCard} ${getCardClass()}`} onClick={handleClick}>
          {/* Header: order number */}
          <div className={styles.header}>
            <span className={styles.orderNumber}>{order.orderNumber}</span>
            {!isHalteverbot && (
              <div className={styles.timeInfo}>
                <Clock size={14} />
                <span>{formatTime(order.scheduledDate)}</span>
              </div>
            )}
          </div>

          {/* Type badge row */}
          <div className={styles.jobTypeRow}>
            <span className={`${styles.jobTypeBadge} ${isHalteverbot ? styles.jobTypeBadgeHalteverbot : styles.jobTypeBadgeBaustelle}`}>
              {isHalteverbot && primarySign ? (
                <VerkehrszeichenSign code={primarySign.code} size={18} />
              ) : (
                <span>🚧</span>
              )}
              {getJobTypeLabel().toUpperCase()}
            </span>
            <span className={`${styles.actionTag} ${getActionTypeClass()}`}>
              {order.actionType === 'aufsteller' ? 'Aufsteller' : 'Abholer'}
            </span>
          </div>

          {/* Content: address left, sign right */}
          <div className={styles.contentRow}>
            <div className={styles.contentLeft}>
              <div className={styles.location}>
                <div className={styles.locationText}>
                  <MapPin size={14} />
                  {order.location.street} {order.location.number}
                </div>
                <div className={styles.locationAddress}>
                  {order.location.postalCode} {order.location.city}
                </div>
              </div>

              {/* Validity period box for Halteverbot */}
              {order.validityPeriod ? (
                <div className={styles.validityBox}>
                  <span className={styles.validityDate}>
                    {order.validityPeriod.dateFrom} – {order.validityPeriod.dateTo}
                  </span>
                  <span className={styles.validityTime}>
                    {order.validityPeriod.timeFrom} – {order.validityPeriod.timeTo} Uhr
                  </span>
                </div>
              ) : (
                <p className={styles.description}>{order.description}</p>
              )}
            </div>

            {/* Sign on the right for Halteverbot */}
            {isHalteverbot && primarySign && (
              <div className={styles.signRight}>
                <VerkehrszeichenSign code={primarySign.code} size={90} />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button
              className={`${styles.actionButton} ${hasSketch ? styles.hasContent : ''}`}
              onClick={e => { e.stopPropagation(); setShowSketchModal(true); }}
            >
              <Map size={16} />
              <span>Skizze</span>
              {hasSketch && <div className={getIndicatorClass()} />}
            </button>
            <button className={styles.actionButton} onClick={e => { e.stopPropagation(); setShowMessageModal(true); }}>
              <MessageSquare size={16} />
              <span>Nachricht</span>
            </button>
            <button
              className={`${styles.actionButton} ${documentCount > 0 ? styles.hasContent : ''}`}
              onClick={e => { e.stopPropagation(); setShowDocumentModal(true); }}
            >
              <FileUp size={16} />
              <span>Dokument</span>
              {documentCount > 0 && <div className={getBadgeClass()}>{documentCount}</div>}
            </button>
          </div>

          {isAufsteller && !isCompleted && (
            <button
              className={`${styles.completeButton} ${!canComplete ? styles.completeButtonDisabled : ''}`}
              onClick={e => { e.stopPropagation(); if (canComplete) completeOrder(order.id); }}
              disabled={!canComplete}
            >
              Als erledigt markieren
            </button>
          )}
        </div>
      </div>

      {showSketchModal && <SketchModal orderId={order.id} onClose={() => setShowSketchModal(false)} />}
      {showDocumentModal && <DocumentUploadModal orderId={order.id} onClose={() => setShowDocumentModal(false)} />}
      {showMessageModal && <MessageModal orderId={order.id} onClose={() => setShowMessageModal(false)} />}
    </>
  );
}
