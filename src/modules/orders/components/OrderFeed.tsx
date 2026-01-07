import { useState, useEffect } from 'react';
import { ListFilter, CircleAlert, Package, Search, ClipboardList, Clock } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useOrderUploads } from '../../../contexts/OrderUploadsContext';
import { OrderCard } from './OrderCard';
import { BaustelleView } from './BaustelleView';
import { BereitschaftView } from './BereitschaftView';
import { KontrollfahrtView } from './KontrollfahrtView';
import { MapTab } from './MapTab';
import type { OrderDto } from '../types';
import styles from './OrderFeed.module.scss';

type OrderTypeTab = 'halteverbot' | 'baustelle' | 'bereitschaft' | 'kontrollfahrt';
type OrderFilterTab = 'todo' | 'completed';

interface OrderFeedProps {
  onOrderClick?: (order: OrderDto) => void;
  onNavigateToProfile?: () => void;
}

export function OrderFeed({ onOrderClick, onNavigateToProfile }: OrderFeedProps): JSX.Element {
  const [activeTypeTab, setActiveTypeTab] = useState<OrderTypeTab>('halteverbot');
  const [activeFilterTab, setActiveFilterTab] = useState<OrderFilterTab>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [tourStarted, setTourStarted] = useState(false);
  const [workTimeSeconds, setWorkTimeSeconds] = useState(0);
  const { orders, isLoading, error, refetch } = useOrders();
  const { isOrderCompleted } = useOrderUploads();

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

  // Filter orders by type
  const getOrdersByType = (type: OrderTypeTab): OrderDto[] => {
    switch (type) {
      case 'halteverbot':
        return orders.filter(order => order.jobType === 'no-parking-zone');
      case 'baustelle':
        return orders.filter(order => 
          order.jobType === 'road-closure' || 
          order.jobType === 'traffic-safety' || 
          order.jobType === 'construction-site'
        );
      case 'kontrollfahrt':
        // Kontrollfahrt hat eigene Aufträge ohne Aufsteller/Abholer
        return orders.filter(order => order.jobType === 'no-parking-zone'); // TODO: Add proper type
      case 'bereitschaft':
        return [];
      default:
        return orders;
    }
  };

  const filterOrders = (orderList: OrderDto[]): OrderDto[] => {
    if (!searchQuery) return orderList;
    const query = searchQuery.toLowerCase();
    return orderList.filter(order => 
      order.orderNumber.toLowerCase().includes(query) ||
      order.location.street.toLowerCase().includes(query) ||
      order.location.city.toLowerCase().includes(query) ||
      order.location.postalCode.toLowerCase().includes(query) ||
      order.description.toLowerCase().includes(query) ||
      (order.notes && order.notes.toLowerCase().includes(query))
    );
  };

  // Count orders per tab
  const halteverbotOrders = orders.filter(o => o.jobType === 'no-parking-zone');
  const baustelleOrders = orders.filter(o => 
    o.jobType === 'road-closure' || 
    o.jobType === 'traffic-safety' || 
    o.jobType === 'construction-site'
  );
  const kontrollfahrtOrders = orders.filter(o => o.jobType === 'no-parking-zone'); // TODO: proper type

  // Count ToDo and Completed for each tab
  const getTabCounts = (orderList: OrderDto[]) => {
    const todoCount = orderList.filter(o => !isOrderCompleted(o.id)).length;
    const completedCount = orderList.filter(o => isOrderCompleted(o.id)).length;
    return { todoCount, completedCount };
  };

  const halteverbotCounts = getTabCounts(halteverbotOrders);
  const baustelleCounts = getTabCounts(baustelleOrders);
  const kontrollfahrtCounts = getTabCounts(kontrollfahrtOrders);

  const currentOrders = getOrdersByType(activeTypeTab);
  const filteredOrders = filterOrders(currentOrders);

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

  // Render Bereitschaft or Baustelle Views
  if (activeTypeTab === 'bereitschaft') {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <ClipboardList className={styles.headerIcon} size={24} />
            <h1 className={styles.title}>Aufträge</h1>
          </div>

          <div className={styles.badgeRow}>
            <div className={styles.badgeGroup}>
              <span className={styles.tabBadge}>{halteverbotCounts.todoCount}</span>
              <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>{halteverbotCounts.completedCount}</span>
            </div>
            <div className={styles.badgeGroup}>
              <span className={styles.tabBadge}>{baustelleCounts.todoCount}</span>
              <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>{baustelleCounts.completedCount}</span>
            </div>
            <div className={styles.badgeGroup}>
              <span className={styles.tabBadge}>0</span>
              <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>0</span>
            </div>
            <div className={styles.badgeGroup}>
              <span className={styles.tabBadge}>{kontrollfahrtCounts.todoCount}</span>
              <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>{kontrollfahrtCounts.completedCount}</span>
            </div>
          </div>

          <div className={styles.viewTabs}>
            <button
              className={`${styles.viewTab} ${
                activeTypeTab === 'halteverbot' ? styles.viewTabActive : ''
              }`}
              onClick={() => setActiveTypeTab('halteverbot')}
            >
              Halteverbot
            </button>
            <button
              className={`${styles.viewTab} ${
                activeTypeTab === 'baustelle' ? styles.viewTabActive : ''
              }`}
              onClick={() => setActiveTypeTab('baustelle')}
            >
              Baustelle
            </button>
            <button
              className={`${styles.viewTab} ${
                activeTypeTab === 'bereitschaft' ? styles.viewTabActive : ''
              }`}
              onClick={() => setActiveTypeTab('bereitschaft')}
            >
              Bereitschaft
            </button>
            <button
              className={`${styles.viewTab} ${
                activeTypeTab === 'kontrollfahrt' ? styles.viewTabActive : ''
              }`}
              onClick={() => setActiveTypeTab('kontrollfahrt')}
            >
              Kontrolle
            </button>
          </div>
        </div>
        <BereitschaftView />
      </div>
    );
  }

  if (activeTypeTab === 'baustelle') {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <ClipboardList className={styles.headerIcon} size={24} />
            <h1 className={styles.title}>Aufträge</h1>
          </div>

          <div className={styles.badgeRow}>
            <div className={styles.badgeGroup}>
              <span className={styles.tabBadge}>{halteverbotCounts.todoCount}</span>
              <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>{halteverbotCounts.completedCount}</span>
            </div>
            <div className={styles.badgeGroup}>
              <span className={styles.tabBadge}>{baustelleCounts.todoCount}</span>
              <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>{baustelleCounts.completedCount}</span>
            </div>
            <div className={styles.badgeGroup}>
              <span className={styles.tabBadge}>0</span>
              <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>0</span>
            </div>
            <div className={styles.badgeGroup}>
              <span className={styles.tabBadge}>{kontrollfahrtCounts.todoCount}</span>
              <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>{kontrollfahrtCounts.completedCount}</span>
            </div>
          </div>

          <div className={styles.viewTabs}>
            <button
              className={`${styles.viewTab} ${
                activeTypeTab === 'halteverbot' ? styles.viewTabActive : ''
              }`}
              onClick={() => setActiveTypeTab('halteverbot')}
            >
              Halteverbot
            </button>
            <button
              className={`${styles.viewTab} ${
                activeTypeTab === 'baustelle' ? styles.viewTabActive : ''
              }`}
              onClick={() => setActiveTypeTab('baustelle')}
            >
              Baustelle
            </button>
            <button
              className={`${styles.viewTab} ${
                activeTypeTab === 'bereitschaft' ? styles.viewTabActive : ''
              }`}
              onClick={() => setActiveTypeTab('bereitschaft')}
            >
              Bereitschaft
            </button>
            <button
              className={`${styles.viewTab} ${
                activeTypeTab === 'kontrollfahrt' ? styles.viewTabActive : ''
              }`}
              onClick={() => setActiveTypeTab('kontrollfahrt')}
            >
              Kontrolle
            </button>
          </div>
        </div>
        <BaustelleView onOrderClick={onOrderClick} />
      </div>
    );
  }

  if (activeTypeTab === 'kontrollfahrt') {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <ClipboardList className={styles.headerIcon} size={24} />
            <h1 className={styles.title}>Aufträge</h1>
          </div>

          <div className={styles.badgeRow}>
            <div className={styles.badgeGroup}>
              <span className={styles.tabBadge}>{halteverbotCounts.todoCount}</span>
              <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>{halteverbotCounts.completedCount}</span>
            </div>
            <div className={styles.badgeGroup}>
              <span className={styles.tabBadge}>{baustelleCounts.todoCount}</span>
              <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>{baustelleCounts.completedCount}</span>
            </div>
            <div className={styles.badgeGroup}>
              <span className={styles.tabBadge}>0</span>
              <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>0</span>
            </div>
            <div className={styles.badgeGroup}>
              <span className={styles.tabBadge}>{kontrollfahrtCounts.todoCount}</span>
              <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>{kontrollfahrtCounts.completedCount}</span>
            </div>
          </div>

          <div className={styles.viewTabs}>
            <button
              className={`${styles.viewTab} ${
                activeTypeTab === 'halteverbot' ? styles.viewTabActive : ''
              }`}
              onClick={() => setActiveTypeTab('halteverbot')}
            >
              Halteverbot
            </button>
            <button
              className={`${styles.viewTab} ${
                activeTypeTab === 'baustelle' ? styles.viewTabActive : ''
              }`}
              onClick={() => setActiveTypeTab('baustelle')}
            >
              Baustelle
            </button>
            <button
              className={`${styles.viewTab} ${
                activeTypeTab === 'bereitschaft' ? styles.viewTabActive : ''
              }`}
              onClick={() => setActiveTypeTab('bereitschaft')}
            >
              Bereitschaft
            </button>
            <button
              className={`${styles.viewTab} ${
                activeTypeTab === 'kontrollfahrt' ? styles.viewTabActive : ''
              }`}
              onClick={() => setActiveTypeTab('kontrollfahrt')}
            >
              Kontrolle
            </button>
          </div>
        </div>
        <KontrollfahrtView onOrderClick={onOrderClick} />
      </div>
    );
  }

  return (
    <div className={styles.feedContainer}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <ClipboardList className={styles.headerIcon} size={24} />
          <h1 className={styles.title}>Aufträge</h1>
        </div>

        <div className={styles.badgeRow}>
          <div className={styles.badgeGroup}>
            <span className={styles.tabBadge}>{halteverbotCounts.todoCount}</span>
            <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>{halteverbotCounts.completedCount}</span>
          </div>
          <div className={styles.badgeGroup}>
            <span className={styles.tabBadge}>{baustelleCounts.todoCount}</span>
            <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>{baustelleCounts.completedCount}</span>
          </div>
          <div className={styles.badgeGroup}>
            <span className={styles.tabBadge}>0</span>
            <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>0</span>
          </div>
          <div className={styles.badgeGroup}>
            <span className={styles.tabBadge}>{kontrollfahrtCounts.todoCount}</span>
            <span className={`${styles.tabBadge} ${styles.tabBadgeGreen}`}>{kontrollfahrtCounts.completedCount}</span>
          </div>
        </div>

        <div className={styles.viewTabs}>
          <button
            className={`${styles.viewTab} ${ activeTypeTab === 'halteverbot' ? styles.viewTabActive : ''
            }`}
            onClick={() => setActiveTypeTab('halteverbot')}
          >
            Halteverbot
          </button>
          <button
            className={`${styles.viewTab} ${
              activeTypeTab === 'baustelle' ? styles.viewTabActive : ''
            }`}
            onClick={() => setActiveTypeTab('baustelle')}
          >
            Baustelle
          </button>
          <button
            className={`${styles.viewTab} ${
              activeTypeTab === 'bereitschaft' ? styles.viewTabActive : ''
            }`}
            onClick={() => setActiveTypeTab('bereitschaft')}
          >
            Bereitschaft
          </button>
          <button
            className={`${styles.viewTab} ${
              activeTypeTab === 'kontrollfahrt' ? styles.viewTabActive : ''
            }`}
            onClick={() => setActiveTypeTab('kontrollfahrt')}
          >
            Kontrolle
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.actionButtons}>
          <button 
            className={`${styles.actionButton} ${styles.clockInButton} ${isClockedIn ? styles.clockedIn : ''}`}
            onClick={() => setIsClockedIn(!isClockedIn)}
          >
            {isClockedIn ? 'Ausstempeln' : 'Einstempeln'}
          </button>
          <button 
            className={`${styles.actionButton} ${styles.startTourButton}`}
            disabled={!isClockedIn}
            onClick={() => setTourStarted(!tourStarted)}
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

        {filteredOrders.filter(order => 
          activeFilterTab === 'todo' 
            ? !isOrderCompleted(order.id) 
            : isOrderCompleted(order.id)
        ).length === 0 ? (
          <div className={styles.emptyState}>
            <Package className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              {activeFilterTab === 'todo' 
                ? 'Alle Aufträge erledigt!' 
                : 'Noch keine erledigten Aufträge'}
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
    </div>
  );
}