import { Search, Map, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useOrderUploads } from '../../../contexts/OrderUploadsContext';
import { useActivityLog } from '../../../contexts/ActivityLogContext';
import { KontrollfahrtCard } from './KontrollfahrtCard';
import { MapTab } from './MapTab';
import type { OrderDto } from '../types';
import styles from './KontrollfahrtView.module.scss';

type KontrollfahrtFilterTab = 'todo' | 'completed';

interface KontrollfahrtViewProps {
  onOrderClick?: (order: OrderDto) => void;
  onNavigateToProfile?: () => void;
}

export function KontrollfahrtView({ onOrderClick, onNavigateToProfile }: KontrollfahrtViewProps): JSX.Element {
  const [activeFilterTab, setActiveFilterTab] = useState<KontrollfahrtFilterTab>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [tourStarted, setTourStarted] = useState(false);
  const [workTimeSeconds, setWorkTimeSeconds] = useState(0);
  const { orders, isLoading } = useOrders();
  const { isOrderCompleted } = useOrderUploads();
  const { addLog } = useActivityLog();

  const targetHoursPerDay = 8;

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isClockedIn) {
      interval = setInterval(() => {
        setWorkTimeSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClockedIn]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter Kontrollfahrt-Aufträge (für jetzt no-parking-zone, später eigener Type)
  const kontrollfahrtOrders = orders.filter(order => 
    order.jobType === 'no-parking-zone'
  );

  const filterOrders = (orderList: OrderDto[]): OrderDto[] => {
    if (!searchQuery) return orderList;
    const query = searchQuery.toLowerCase();
    return orderList.filter(order => 
      order.orderNumber.toLowerCase().includes(query) ||
      order.location.street.toLowerCase().includes(query) ||
      order.location.city.toLowerCase().includes(query) ||
      order.description.toLowerCase().includes(query)
    );
  };

  const filteredOrders = filterOrders(kontrollfahrtOrders);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <p>Aufträge werden geladen...</p>
      </div>
    );
  }

  return (
    <div className={styles.kontrollfahrtContainer}>
      <div className={styles.actionButtons}>
        <button 
          className={`${styles.actionButton} ${styles.clockInButton} ${isClockedIn ? styles.clockedIn : ''}`}
          onClick={() => {
            const newState = !isClockedIn;
            setIsClockedIn(newState);
            if (newState) {
              addLog('Eingestempelt', `Arbeit begonnen um ${new Date().toLocaleTimeString('de-DE')}`, 'time');
            } else {
              addLog('Ausgestempelt', `Arbeit beendet um ${new Date().toLocaleTimeString('de-DE')} | Dauer: ${formatTime(workTimeSeconds)}`, 'time');
              setWorkTimeSeconds(0);
            }
          }}
        >
          {isClockedIn ? 'Ausstempeln' : 'Einstempeln'}
        </button>
        <button 
          className={`${styles.actionButton} ${styles.startTourButton}`}
          disabled={!isClockedIn}
          onClick={() => {
            const newState = !tourStarted;
            setTourStarted(newState);
            if (newState) {
              addLog('Tour gestartet', `Tour begonnen um ${new Date().toLocaleTimeString('de-DE')}`, 'time');
            } else {
              addLog('Tour beendet', `Tour beendet um ${new Date().toLocaleTimeString('de-DE')}`, 'time');
            }
          }}
        >
          {tourStarted ? 'Tour beenden' : 'Tour starten'}
        </button>
      </div>

      {isClockedIn && (
        <div 
          className={styles.workTimeTracker}
          onClick={onNavigateToProfile}
        >
          <div className={styles.workTimeContent}>
            <Clock className={styles.workTimeIcon} size={18} />
            <div className={styles.workTimeInfo}>
              <div className={styles.workTimeLabel}>Arbeitszeit heute</div>
              <div className={styles.workTimeValue}>{formatTime(workTimeSeconds)}</div>
            </div>
          </div>
          <div className={styles.workTimeTarget}>
            Soll: {targetHoursPerDay}:00:00
          </div>
        </div>
      )}

      {/* Compact Map */}
      <div className={styles.compactMapContainer}>
        <MapTab orders={filteredOrders} compact />
      </div>

      <div className={styles.searchBox}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Kontrollfahrten durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterTab} ${
            activeFilterTab === 'todo' ? styles.filterTabActive : ''
          }`}
          onClick={() => setActiveFilterTab('todo')}
        >
          ToDo
          <span className={`${styles.filterTabBadge} ${styles.filterTabBadgeTodo}`}>
            {filteredOrders.filter(o => !isOrderCompleted(o.id)).length}
          </span>
        </button>
        <button
          className={`${styles.filterTab} ${
            activeFilterTab === 'completed' ? styles.filterTabActive : ''
          }`}
          onClick={() => setActiveFilterTab('completed')}
        >
          Erledigt
          <span className={`${styles.filterTabBadge} ${styles.filterTabBadgeCompleted}`}>
            {filteredOrders.filter(o => isOrderCompleted(o.id)).length}
          </span>
        </button>
      </div>

      <div className={styles.orderList}>
        {filteredOrders.filter(order => 
          activeFilterTab === 'todo' 
            ? !isOrderCompleted(order.id) 
            : isOrderCompleted(order.id)
        ).length === 0 ? (
          <div className={styles.emptyState}>
            <Map className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              {activeFilterTab === 'todo' 
                ? 'Keine offenen Kontrollfahrten' 
                : 'Noch keine erledigten Kontrollfahrten'}
            </p>
          </div>
        ) : (
          filteredOrders
            .filter(order => 
              activeFilterTab === 'todo' 
                ? !isOrderCompleted(order.id) 
                : isOrderCompleted(order.id)
            )
            .map((order, index, arr) => (
              <KontrollfahrtCard 
                key={order.id} 
                order={order}
                orderIndex={index}
                isLastOrder={index === arr.length - 1}
                onClick={onOrderClick}
              />
            ))
        )}
      </div>
    </div>
  );
}