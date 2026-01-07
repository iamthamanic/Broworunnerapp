import { ArrowLeft, MapPin, Clock, Timer } from 'lucide-react';
import type { OrderDto } from '../types';
import styles from './OrderDetailPage.module.scss';

interface OrderDetailPageProps {
  order: OrderDto;
  onBack: () => void;
  onStartJob: (orderId: string) => void;
  onCompleteJob: (orderId: string) => void;
}

export function OrderDetailPage({
  order,
  onBack,
  onStartJob,
  onCompleteJob,
}: OrderDetailPageProps): JSX.Element {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('de-DE', {
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

  const getStatusLabel = (): string => {
    switch (order.status) {
      case 'pending':
        return 'Ausstehend';
      case 'in-progress':
        return 'In Bearbeitung';
      case 'completed':
        return 'Abgeschlossen';
      case 'cancelled':
        return 'Storniert';
      default:
        return order.status;
    }
  };

  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack} aria-label="Zurück">
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.headerTitle}>{order.orderNumber}</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Auftragsinformationen</h2>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Auftragstyp</span>
              <span className={styles.infoValue}>{getJobTypeLabel()}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Status</span>
              <span className={styles.infoValue}>{getStatusLabel()}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Priorität</span>
              <span className={styles.infoValue}>{order.priority.toUpperCase()}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Datum</span>
              <span className={styles.infoValue}>
                {formatDate(order.scheduledDate)}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Uhrzeit</span>
              <span className={styles.infoValue}>
                {formatTime(order.scheduledDate)}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Dauer (geschätzt)</span>
              <span className={styles.infoValue}>{order.estimatedDuration} Min</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Standort</h2>
          <div className={styles.locationCard}>
            <div className={styles.locationHeader}>
              <MapPin className={styles.locationIcon} size={20} />
              <div>
                <div className={styles.locationAddress}>
                  {order.location.street} {order.location.number}
                </div>
                <div className={styles.locationCity}>
                  {order.location.postalCode} {order.location.city}
                </div>
              </div>
            </div>
            <div className={styles.mapPlaceholder}>
              Karte wird geladen...
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Beschreibung</h2>
          <div className={styles.infoCard}>
            <p>{order.description}</p>
          </div>
        </div>

        {order.materials && order.materials.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Benötigte Materialien</h2>
            <div className={styles.materialsList}>
              {order.materials.map((material, index) => (
                <div key={index} className={styles.materialItem}>
                  <div className={styles.materialCheck} />
                  <span className={styles.materialText}>{material}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {order.status === 'pending' && (
          <button
            className={`${styles.actionButton} ${styles.primaryButton}`}
            onClick={() => onStartJob(order.id)}
          >
            Auftrag starten
          </button>
        )}
        {order.status === 'in-progress' && (
          <button
            className={`${styles.actionButton} ${styles.primaryButton}`}
            onClick={() => onCompleteJob(order.id)}
          >
            Auftrag abschließen
          </button>
        )}
      </div>
    </div>
  );
}
