import { TrendingUp, TrendingDown } from 'lucide-react';
import type { OrderDto } from '../types';
import styles from './FahrzeugInventar.module.scss';

interface MaterialEntry {
  name: string;
  aufsteller: number;
  abholer: number;
}

function getMaterialsFromOrder(order: OrderDto): Record<string, number> {
  const result: Record<string, number> = {};

  if (order.jobType === 'no-parking-zone') {
    const signs = order.isZone ? 2 : (order.numberOfSigns ?? 1);
    result['Halteverbot-Schild'] = signs;
    result['Zusatzschild'] = signs;
    result['Stange'] = signs;
    result['Standfuß-Stein'] = signs * 2;
  }

  if (order.baustelleMaterials) {
    for (const m of order.baustelleMaterials) {
      result[m.name] = (result[m.name] ?? 0) + m.sollMenge;
    }
  }

  return result;
}

interface FahrzeugInventarProps {
  orders: OrderDto[];
}

export function FahrzeugInventar({ orders }: FahrzeugInventarProps): JSX.Element {
  const materialMap: Record<string, MaterialEntry> = {};

  for (const order of orders) {
    const mats = getMaterialsFromOrder(order);
    for (const [name, count] of Object.entries(mats)) {
      if (!materialMap[name]) materialMap[name] = { name, aufsteller: 0, abholer: 0 };
      if (order.actionType === 'aufsteller') {
        materialMap[name].aufsteller += count;
      } else {
        materialMap[name].abholer += count;
      }
    }
  }

  const entries = Object.values(materialMap).sort((a, b) => a.name.localeCompare(b.name));

  if (entries.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Keine Materialien für diese Tour erfasst.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <TrendingUp size={12} className={styles.legendUp} /> Aufsteller (benötigt)
        </span>
        <span className={styles.legendItem}>
          <TrendingDown size={12} className={styles.legendDown} /> Abholer (rückgeführt)
        </span>
      </div>

      <div className={styles.list}>
        {entries.map(entry => {
          const net = entry.abholer - entry.aufsteller;
          return (
            <div key={entry.name} className={styles.row}>
              <span className={styles.materialName}>{entry.name}</span>
              <div className={styles.counts}>
                {entry.aufsteller > 0 && (
                  <span className={styles.aufstellerCount}>
                    <TrendingUp size={12} /> {entry.aufsteller}
                  </span>
                )}
                {entry.abholer > 0 && (
                  <span className={styles.abholerCount}>
                    <TrendingDown size={12} /> {entry.abholer}
                  </span>
                )}
                <span className={`${styles.netCount} ${net >= 0 ? styles.netPositive : styles.netNegative}`}>
                  {net >= 0 ? '+' : ''}{net}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className={styles.hint}>
        Nettowert = Rückführungen − Verbaucht. Positiv bedeutet Fahrzeug wird voller.
      </p>
    </div>
  );
}
