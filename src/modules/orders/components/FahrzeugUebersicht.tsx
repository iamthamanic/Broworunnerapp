import { MapPin, Clock, Package, CheckCircle, Truck } from 'lucide-react';
import type { OrderDto } from '../types';
import styles from './FahrzeugUebersicht.module.scss';

interface FahrzeugUebersichtProps {
  orders: OrderDto[];
}

export function FahrzeugUebersicht({ orders }: FahrzeugUebersichtProps): JSX.Element {
  const aufsteller = orders.filter(o => o.actionType === 'aufsteller');
  const abholer = orders.filter(o => o.actionType === 'abholer');
  const totalDuration = orders.reduce((sum, o) => sum + o.estimatedDuration, 0);
  const halteverbot = orders.filter(o => o.jobType === 'no-parking-zone');
  const baustelle = orders.filter(o => o.jobType !== 'no-parking-zone');

  const formatDuration = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Package size={20} className={styles.statIcon} />
          <span className={styles.statValue}>{orders.length}</span>
          <span className={styles.statLabel}>Aufträge gesamt</span>
        </div>
        <div className={styles.statCard}>
          <Clock size={20} className={styles.statIcon} />
          <span className={styles.statValue}>{formatDuration(totalDuration)}</span>
          <span className={styles.statLabel}>Geschätzte Dauer</span>
        </div>
        <div className={styles.statCard}>
          <Truck size={20} className={styles.statIcon} />
          <span className={styles.statValue}>{aufsteller.length}</span>
          <span className={styles.statLabel}>Aufsteller</span>
        </div>
        <div className={styles.statCard}>
          <CheckCircle size={20} className={styles.statIcon} />
          <span className={styles.statValue}>{abholer.length}</span>
          <span className={styles.statLabel}>Abholer</span>
        </div>
      </div>

      <div className={styles.typeBreakdown}>
        <h3 className={styles.sectionTitle}>Auftragstypen</h3>
        <div className={styles.typeRow}>
          <span className={styles.typeDot} style={{ background: '#3c61bc' }} />
          <span className={styles.typeLabel}>Halteverbot</span>
          <span className={styles.typeCount}>{halteverbot.length}</span>
        </div>
        <div className={styles.typeRow}>
          <span className={styles.typeDot} style={{ background: '#f97316' }} />
          <span className={styles.typeLabel}>Baustelle</span>
          <span className={styles.typeCount}>{baustelle.length}</span>
        </div>
      </div>

      <div className={styles.orderList}>
        <h3 className={styles.sectionTitle}>Tourverlauf</h3>
        {orders.map((order, index) => (
          <div key={order.id} className={styles.orderRow}>
            <span className={styles.orderIndex}>{index + 1}</span>
            <div className={styles.orderInfo}>
              <span className={styles.orderNumber}>{order.orderNumber}</span>
              <span className={styles.orderAddress}>
                <MapPin size={11} />
                {order.location.street} {order.location.number}
              </span>
            </div>
            <span className={`${styles.orderType} ${order.actionType === 'aufsteller' ? styles.aufsteller : styles.abholer}`}>
              {order.actionType === 'aufsteller' ? 'Aufst.' : 'Abhol.'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
