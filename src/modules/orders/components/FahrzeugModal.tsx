import { X, Package, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { FahrzeugInventar } from './FahrzeugInventar';
import { FahrzeugUebersicht } from './FahrzeugUebersicht';
import type { OrderDto } from '../types';
import styles from './FahrzeugModal.module.scss';

type FahrzeugTab = 'inventar' | 'uebersicht';

interface FahrzeugModalProps {
  orders: OrderDto[];
  onClose: () => void;
}

export function FahrzeugModal({ orders, onClose }: FahrzeugModalProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<FahrzeugTab>('inventar');

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Fahrzeug</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Schließen">
            <X size={20} />
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'inventar' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('inventar')}
          >
            <Package size={15} />
            Inventar
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'uebersicht' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('uebersicht')}
          >
            <LayoutDashboard size={15} />
            Übersicht
          </button>
        </div>

        <div className={styles.body}>
          {activeTab === 'inventar'
            ? <FahrzeugInventar orders={orders} />
            : <FahrzeugUebersicht orders={orders} />
          }
        </div>
      </div>
    </div>
  );
}
