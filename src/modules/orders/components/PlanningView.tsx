import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import styles from './PlanningView.module.scss';

type PlanningStatus = 'planned' | 'confirmed' | 'pending';
type Category = 'halteverbot' | 'absicherung' | 'baustelle';

interface PlannedOrder {
  id: string;
  address: string;
  addressDetails: string;
  category: Category;
  type: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  materials: string[];
  notes: string;
  status: PlanningStatus;
}

const mockPlannedOrders: PlannedOrder[] = [
  {
    id: '1',
    address: 'Berliner Str. 123',
    addressDetails: '10715 Berlin',
    category: 'halteverbot',
    type: 'Umzug',
    startDate: '15.01.2026',
    endDate: '15.01.2026',
    startTime: '08:00',
    endTime: '18:00',
    materials: ['4x Halteverbotsschild', '2x Ständer'],
    notes: 'Kunde wurde informiert. Aufstellung am Vortag.',
    status: 'confirmed',
  },
  {
    id: '2',
    address: 'Hauptstr. 45',
    addressDetails: '10827 Berlin',
    category: 'baustelle',
    type: 'Straßenbau',
    startDate: '16.01.2026',
    endDate: '20.01.2026',
    startTime: '07:00',
    endTime: '16:00',
    materials: ['Absperrungen', 'Warnschilder', 'Pylonen'],
    notes: 'Koordination mit Bauleitung erforderlich.',
    status: 'planned',
  },
  {
    id: '3',
    address: 'Kastanienallee 78',
    addressDetails: '10435 Berlin',
    category: 'absicherung',
    type: 'Event',
    startDate: '17.01.2026',
    endDate: '17.01.2026',
    startTime: '14:00',
    endTime: '22:00',
    materials: ['Absperrband', 'Warnleuchten', '10x Pylonen'],
    notes: 'Straßenfest - besondere Aufmerksamkeit nötig.',
    status: 'pending',
  },
];

const getCategoryLabel = (category: Category): string => {
  const labels: Record<Category, string> = {
    halteverbot: 'Halteverbot',
    absicherung: 'Absicherung',
    baustelle: 'Baustelle',
  };
  return labels[category];
};

const getStatusLabel = (status: PlanningStatus): string => {
  const labels: Record<PlanningStatus, string> = {
    planned: 'Geplant',
    confirmed: 'Bestätigt',
    pending: 'Ausstehend',
  };
  return labels[status];
};

export function PlanningView(): JSX.Element {
  const [currentWeek, setCurrentWeek] = useState(3);
  const [activeFilter, setActiveFilter] = useState<Category | 'all'>('all');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const filteredOrders = mockPlannedOrders.filter((order) => {
    if (activeFilter === 'all') return true;
    return order.category === activeFilter;
  });

  const handlePreviousWeek = (): void => {
    setCurrentWeek((prev) => Math.max(1, prev - 1));
  };

  const handleNextWeek = (): void => {
    setCurrentWeek((prev) => Math.min(52, prev + 1));
  };

  const checkScrollPosition = (): void => {
    if (!contentRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = contentRef.current;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
    setShowScrollIndicator(!isAtEnd);
  };

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    checkScrollPosition();

    contentElement.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      contentElement.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [filteredOrders]);

  return (
    <div className={styles.planningView}>
      <div className={styles.header}>
        <div className={styles.weekSelector}>
          <button
            className={styles.weekButton}
            onClick={handlePreviousWeek}
            disabled={currentWeek <= 1}
            aria-label="Vorherige Woche"
          >
            <ChevronLeft size={20} />
          </button>

          <div className={styles.weekInfo}>
            <p className={styles.weekLabel}>Kalenderwoche</p>
            <h2 className={styles.weekNumber}>KW {currentWeek} / 2026</h2>
          </div>

          <button
            className={styles.weekButton}
            onClick={handleNextWeek}
            disabled={currentWeek >= 52}
            aria-label="Nächste Woche"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterChip} ${
              activeFilter === 'all' ? styles.filterChipActive : ''
            }`}
            onClick={() => setActiveFilter('all')}
          >
            Alle
          </button>
          <button
            className={`${styles.filterChip} ${
              activeFilter === 'halteverbot' ? styles.filterChipActive : ''
            }`}
            onClick={() => setActiveFilter('halteverbot')}
          >
            Halteverbot
          </button>
          <button
            className={`${styles.filterChip} ${
              activeFilter === 'absicherung' ? styles.filterChipActive : ''
            }`}
            onClick={() => setActiveFilter('absicherung')}
          >
            Absicherung
          </button>
          <button
            className={`${styles.filterChip} ${
              activeFilter === 'baustelle' ? styles.filterChipActive : ''
            }`}
            onClick={() => setActiveFilter('baustelle')}
          >
            Baustelle
          </button>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div ref={contentRef} className={styles.content}>
          {filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Calendar size={32} />
              </div>
              <h3 className={styles.emptyTitle}>Keine Aufträge geplant</h3>
              <p className={styles.emptyText}>
                Für diese Woche sind noch keine Aufträge in Planung.
              </p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.th}>Adresse</th>
                    <th className={styles.th}>Kategorie</th>
                    <th className={styles.th}>Art</th>
                    <th className={styles.th}>Start</th>
                    <th className={styles.th}>Ende</th>
                    <th className={styles.th}>Uhrzeit</th>
                    <th className={styles.th}>Material</th>
                    <th className={styles.th}>Hinweise</th>
                    <th className={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className={styles.row}>
                      <td className={styles.td}>
                        <div className={styles.address}>{order.address}</div>
                        <div className={styles.addressDetails}>
                          {order.addressDetails}
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span
                          className={`${styles.category} ${
                            styles[`category${order.category.charAt(0).toUpperCase() + order.category.slice(1)}`]
                          }`}
                        >
                          {getCategoryLabel(order.category)}
                        </span>
                      </td>
                      <td className={styles.td}>{order.type}</td>
                      <td className={styles.td}>
                        <div className={styles.date}>{order.startDate}</div>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.date}>{order.endDate}</div>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.time}>
                          {order.startTime} - {order.endTime}
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.materials}>
                          {order.materials.map((material, index) => (
                            <span key={index} className={styles.materialItem}>
                              {material}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.notes}>{order.notes}</div>
                      </td>
                      <td className={styles.td}>
                        <span
                          className={`${styles.status} ${
                            styles[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`]
                          }`}
                        >
                          <span className={styles.statusDot} />
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {showScrollIndicator && filteredOrders.length > 0 && (
          <div className={styles.scrollIndicator}>
            <ChevronRight size={20} />
          </div>
        )}
      </div>
    </div>
  );
}