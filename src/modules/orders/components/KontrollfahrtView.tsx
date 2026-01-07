import { Search, Map } from 'lucide-react';
import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useOrderUploads } from '../../../contexts/OrderUploadsContext';
import { KontrollfahrtCard } from './KontrollfahrtCard';
import { MapTab } from './MapTab';
import type { OrderDto } from '../types';
import styles from './KontrollfahrtView.module.scss';

type KontrollfahrtFilterTab = 'todo' | 'completed';

interface KontrollfahrtViewProps {
  onOrderClick?: (order: OrderDto) => void;
}

export function KontrollfahrtView({ onOrderClick }: KontrollfahrtViewProps): JSX.Element {
  const [activeFilterTab, setActiveFilterTab] = useState<KontrollfahrtFilterTab>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const { orders, isLoading } = useOrders();
  const { isOrderCompleted } = useOrderUploads();

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