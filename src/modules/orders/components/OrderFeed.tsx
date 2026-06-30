import { useState, useEffect } from 'react';
import { CircleAlert, Package, Search, Clock, Truck, LogIn, Pause } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useOrderUploads } from '../../../contexts/OrderUploadsContext';
import { useActivityLog } from '../../../contexts/ActivityLogContext';
import { OrderCard } from './OrderCard';
import { MapTab } from './MapTab';
import { FahrzeugModal } from './FahrzeugModal';
import { TopBar } from '../../profile/components/TopBar';
import type { OrderDto } from '../types';
import styles from './OrderFeed.module.scss';

type OrderFilterTab = 'todo' | 'completed';
type CompletedSubTab = 'current-tour' | 'past-tours';

interface OrderFeedProps {
  onOrderClick?: (order: OrderDto) => void;
  onNavigateToProfile?: () => void;
}

export function OrderFeed({ onOrderClick, onNavigateToProfile }: OrderFeedProps): JSX.Element {
  const [activeFilterTab, setActiveFilterTab] = useState<OrderFilterTab>('todo');
  const [completedSubTab, setCompletedSubTab] = useState<CompletedSubTab>('current-tour');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tourStarted, setTourStarted] = useState(false);
  const [workTimeSeconds, setWorkTimeSeconds] = useState(0);
  const [showClockInTooltip, setShowClockInTooltip] = useState(false);
  const [showFahrzeugModal, setShowFahrzeugModal] = useState(false);
  const { orders, isLoading, error, refetch } = useOrders();
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

  const handleMessageClick = (orderId: string): void => {
    console.log('Open message for order:', orderId);
    alert(`Nachricht für Auftrag ${orderId} - Chat-Feature kommt bald!`);
  };

  const matchesSearchQuery = (order: OrderDto): boolean => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(query) ||
      order.location.street.toLowerCase().includes(query) ||
      order.location.city.toLowerCase().includes(query) ||
      order.location.postalCode.toLowerCase().includes(query) ||
      order.description.toLowerCase().includes(query) ||
      (order.notes && order.notes.toLowerCase().includes(query))
    );
  };

  const filterByCompletionStatus = (order: OrderDto): boolean => {
    const completed = isOrderCompleted(order.id);
    if (activeFilterTab === 'todo') return !completed;
    if (activeFilterTab === 'completed') {
      if (!completed) return false;
      return true;
    }
    return false;
  };

  const getFilteredOrders = (): OrderDto[] =>
    orders.filter(filterByCompletionStatus).filter(matchesSearchQuery);

  const todoCount = orders.filter(o => !isOrderCompleted(o.id)).length;
  const completedCount = orders.filter(o => isOrderCompleted(o.id)).length;

  const filteredOrders = getFilteredOrders();

  if (isLoading) {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Aufträge werden geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.errorState}>
          <CircleAlert className={styles.errorIcon} />
          <p className={styles.errorText}>Fehler beim Laden der Aufträge</p>
          <p className={styles.errorMessage}>{error.message}</p>
          <button className={styles.retryButton} onClick={refetch}>
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className={styles.feedContainer}>
      <TopBar onLogout={() => console.log('Logout')} />

      <div className={styles.content}>
        <div className={styles.actionButtons}>
          {/* Einstempeln / Pause */}
          <button
            className={`${styles.actionButton} ${isClockedIn ? (isPaused ? styles.pauseActiveButton : styles.clockedInButton) : styles.clockInButton}`}
            onClick={() => {
              if (!isClockedIn) {
                setIsClockedIn(true);
                setIsPaused(false);
                addLog('Eingestempelt', `Beginn um ${new Date().toLocaleTimeString('de-DE')}`, 'time');
              } else {
                setIsPaused(p => !p);
                addLog(isPaused ? 'Pause beendet' : 'Pause gestartet', new Date().toLocaleTimeString('de-DE'), 'time');
              }
            }}
          >
            {isClockedIn ? <Pause size={16} /> : <LogIn size={16} />}
            {isClockedIn ? (isPaused ? 'Weiter' : 'Pause') : 'Einstempeln'}
          </button>

          {/* Tour starten */}
          <button
            className={`${styles.actionButton} ${styles.startTourButton}`}
            disabled={!isClockedIn}
            onClick={() => {
              const newState = !tourStarted;
              setTourStarted(newState);
              addLog(newState ? 'Tour gestartet' : 'Tour beendet', new Date().toLocaleTimeString('de-DE'), 'time');
            }}
          >
            {tourStarted ? 'Tour beenden' : 'Tour starten'}
          </button>

          {/* Fahrzeug */}
          <button
            className={`${styles.actionButton} ${styles.fahrzeugButton}`}
            onClick={() => setShowFahrzeugModal(true)}
          >
            <Truck size={16} />
            Fahrzeug
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

        <div className={styles.compactMapContainer}>
          <MapTab orders={filteredOrders} />
        </div>

        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Aufträge durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Order Filter Tabs */}
        <div className={styles.orderFilterTabs}>
          <button
            className={`${styles.filterTab} ${
              activeFilterTab === 'todo' ? styles.filterTabActive : ''
            }`}
            onClick={() => setActiveFilterTab('todo')}
          >
            ToDo
            <span className={`${styles.filterTabBadge} ${styles.filterTabBadgeTodo}`}>
              {todoCount}
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
              {completedCount}
            </span>
          </button>
        </div>

        {/* Completed Sub-Tabs */}
        {activeFilterTab === 'completed' && (
          <div className={styles.completedSubTabs}>
            <button
              className={`${styles.subTab} ${
                completedSubTab === 'current-tour' ? styles.subTabActive : ''
              }`}
              onClick={() => setCompletedSubTab('current-tour')}
            >
              Aktuelle Tour
            </button>
            <button
              className={`${styles.subTab} ${
                completedSubTab === 'past-tours' ? styles.subTabActive : ''
              }`}
              onClick={() => setCompletedSubTab('past-tours')}
            >
              Vergangene Touren
            </button>
          </div>
        )}

        {/* Date Filter for Past Tours */}
        {activeFilterTab === 'completed' && completedSubTab === 'past-tours' && (
          <div className={styles.dateFilterContainer}>
            <label htmlFor="date-filter" className={styles.dateFilterLabel}>
              Datum:
            </label>
            <input
              id="date-filter"
              type="date"
              className={styles.dateFilterInput}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <Package className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              {searchQuery
                ? 'Keine Aufträge gefunden'
                : activeFilterTab === 'todo'
                ? 'Alle Aufträge erledigt!'
                : 'Noch keine erledigten Aufträge'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order, index, arr) => (
            <OrderCard
              key={order.id}
              order={order}
              orderIndex={index}
              isLastOrder={index === arr.length - 1}
              onClick={onOrderClick}
              onMessageClick={handleMessageClick}
            />
          ))
        )}
      </div>

      {showFahrzeugModal && (
        <FahrzeugModal
          orders={orders}
          onClose={() => setShowFahrzeugModal(false)}
        />
      )}
    </div>
  );
}