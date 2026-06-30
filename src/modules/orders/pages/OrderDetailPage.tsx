import { useState } from 'react';
import { ArrowLeft, MapPin, X } from 'lucide-react';
import { MaterialInventorySection } from '../components/MaterialInventorySection';
import { VerkehrszeichenSign } from '../components/VerkehrszeichenSign';
import { ImageWithFallback } from '../../../app/components/figma/ImageWithFallback';
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
  const [zoomedImage, setZoomedImage] = useState<{ url: string; name: string } | null>(null);

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
        {order.requiredSigns && order.requiredSigns.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Benötigte Schilder</h2>
            <div className={styles.signGrid}>
              {order.requiredSigns.map((sign, index) => (
                <div key={index} className={styles.signCard}>
                  <VerkehrszeichenSign code={sign.code} size={72} />
                  <div className={styles.signInfo}>
                    <span className={styles.signCode}>{sign.code}</span>
                    <span className={styles.signLabel}>{sign.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {order.baustelleMaterials && order.baustelleMaterials.length > 0 ? (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Materialien (Soll / Ist)</h2>
            <MaterialInventorySection materials={order.baustelleMaterials} />
          </div>
        ) : order.materials && order.materials.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Benötigte Materialien</h2>
            <div className={styles.materialsList}>
              {order.jobType === 'no-parking-zone' ? (() => {
                const signs = order.isZone ? 2 : (order.numberOfSigns ?? 1);
                const stones = signs * 2;
                const halteverbotMaterials = [
                  { name: 'Halteverbot-Schild', count: signs, imageUrl: 'https://images.unsplash.com/photo-1586694680938-d95c921c4f3e?w=600' },
                  { name: 'Zusatzschild', count: signs, imageUrl: 'https://images.unsplash.com/photo-1621274790572-7c32596bc67f?w=600' },
                  { name: 'Stange', count: signs, imageUrl: 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=600' },
                  { name: 'Standfuß-Stein', count: stones, imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600' },
                ];
                return halteverbotMaterials.map((m) => (
                  <div key={m.name} className={styles.materialItem}>
                    <div className={styles.materialCheck} />
                    <button
                      className={styles.materialThumb}
                      onClick={() => setZoomedImage({ url: m.imageUrl, name: m.name })}
                      aria-label={`${m.name} vergrößern`}
                    >
                      <ImageWithFallback src={m.imageUrl} alt={m.name} />
                    </button>
                    <span className={styles.materialText}>{m.name}</span>
                    <span className={styles.materialCount}>{m.count}×</span>
                  </div>
                ));
              })() : order.materials.map((material, index) => (
                <div key={index} className={styles.materialItem}>
                  <div className={styles.materialCheck} />
                  <span className={styles.materialText}>{material}</span>
                </div>
              ))}
            </div>

            {zoomedImage && (
              <div className={styles.lightbox} onClick={() => setZoomedImage(null)}>
                <button className={styles.lightboxClose} aria-label="Schließen">
                  <X size={22} />
                </button>
                <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
                  <ImageWithFallback src={zoomedImage.url} alt={zoomedImage.name} />
                  <span className={styles.lightboxCaption}>{zoomedImage.name}</span>
                </div>
              </div>
            )}
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
