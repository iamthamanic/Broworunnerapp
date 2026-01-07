import { Package, Search } from 'lucide-react';
import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useOrderUploads } from '../../../contexts/OrderUploadsContext';
import { BaustelleCard } from './BaustelleCard';
import { MapTab } from './MapTab';
import type { OrderDto } from '../types';
import styles from './BaustelleView.module.scss';

type BaustelleFilterTab = 'todo' | 'completed';

interface BaustelleViewProps {
  onOrderClick?: (order: OrderDto) => void;
}

export function BaustelleView({ onOrderClick }: BaustelleViewProps): JSX.Element {
  const [activeFilterTab, setActiveFilterTab] = useState<BaustelleFilterTab>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const { orders, isLoading } = useOrders();
  const { isOrderCompleted } = useOrderUploads();

  // Filter nur Baustellen-Aufträge
  const baustelleOrders = orders.filter(order => 
    order.jobType === 'road-closure' || 
    order.jobType === 'traffic-safety' || 
    order.jobType === 'construction-site'
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

  const filteredOrders = filterOrders(baustelleOrders);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <p>Aufträge werden geladen...</p>
      </div>
    );
  }

  return (
    <div className={styles.baustelleContainer}>
      {/* Compact Map */}
      <div className={styles.compactMapContainer}>
        <MapTab orders={filteredOrders} compact />
      </div>

      <div className={styles.searchBox}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Baustellen durchsuchen..."
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
            <Package className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              {activeFilterTab === 'todo' 
                ? 'Keine offenen Baustellen-Aufträge' 
                : 'Noch keine erledigten Baustellen'}
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
              <BaustelleCard 
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