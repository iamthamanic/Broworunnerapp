import { useState } from 'react';
import { OrderUploadsProvider } from '../contexts/OrderUploadsContext';
import { MapProviderProvider } from '../contexts/MapProviderContext';
import { OrderFeed } from '../modules/orders/components/OrderFeed';
import { OrderDetailPage } from '../modules/orders/pages/OrderDetailPage';
import { MaterialView } from '../modules/material/components/MaterialView';
import { ProfileView } from '../modules/profile/components/ProfileView';
import { InfosView } from '../modules/infos';
import { BottomNav } from '../components/layout/BottomNav';
import type { OrderDto } from '../modules/orders/types';
import { orderService } from '../modules/orders/services/orderService';
import styles from './App.module.scss';

type NavTab = 'orders' | 'material' | 'infos' | 'profile';

export default function App(): JSX.Element {
  const [activeTab, setActiveTab] = useState<NavTab>('orders');
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);

  const handleOrderClick = (order: OrderDto): void => {
    setSelectedOrder(order);
  };

  const handleBackToFeed = (): void => {
    setSelectedOrder(null);
  };

  const handleStartJob = async (orderId: string): Promise<void> => {
    try {
      const updatedOrder = await orderService.updateOrder(orderId, {
        status: 'in-progress',
      });
      setSelectedOrder(updatedOrder);
    } catch (error) {
      console.error('Failed to start job:', error);
    }
  };

  const handleCompleteJob = async (orderId: string): Promise<void> => {
    try {
      const updatedOrder = await orderService.updateOrder(orderId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      setSelectedOrder(updatedOrder);
      setTimeout(() => {
        setSelectedOrder(null);
      }, 1500);
    } catch (error) {
      console.error('Failed to complete job:', error);
    }
  };

  const handleTabChange = (tab: NavTab): void => {
    setActiveTab(tab);
    setSelectedOrder(null);
  };

  const handleNavigateToProfile = (): void => {
    setActiveTab('profile');
  };

  const renderTabContent = (): JSX.Element => {
    if (activeTab === 'orders') {
      if (selectedOrder) {
        return (
          <OrderDetailPage
            order={selectedOrder}
            onBack={handleBackToFeed}
            onStartJob={handleStartJob}
            onCompleteJob={handleCompleteJob}
          />
        );
      }
      return <OrderFeed onOrderClick={handleOrderClick} onNavigateToProfile={handleNavigateToProfile} />;
    }

    if (activeTab === 'material') {
      return <MaterialView />;
    }

    if (activeTab === 'infos') {
      return <InfosView />;
    }

    if (activeTab === 'profile') {
      return (
        <ProfileView
          userName="Max Mustermann"
          userRole="Verkehrssicherungsmonteur"
          stats={{
            completedToday: 5,
            completedWeek: 23,
            totalDistance: 245,
            avgRating: 4.8,
          }}
          todayWorkTime="3:24:15"
          weekWorkTime="18:32:45"
          monthWorkTime="76:15:30"
          targetHoursPerDay={8}
          timeEntries={[
            {
              date: '05.01.2026',
              clockIn: '07:45',
              clockOut: '16:30',
              duration: '8:15h',
              breaks: '0:30h',
            },
            {
              date: '03.01.2026',
              clockIn: '08:00',
              clockOut: '16:45',
              duration: '8:15h',
              breaks: '0:30h',
            },
            {
              date: '02.01.2026',
              clockIn: '07:30',
              clockOut: '15:45',
              duration: '7:45h',
              breaks: '0:30h',
            },
          ]}
          onSettingsClick={() => console.log('Settings')}
          onNotificationsClick={() => console.log('Notifications')}
          onHelpClick={() => console.log('Help')}
          onDocumentsClick={() => console.log('Documents')}
          onLogout={() => console.log('Logout')}
        />
      );
    }

    return <div>Tab nicht gefunden</div>;
  };

  return (
    <MapProviderProvider>
      <OrderUploadsProvider>
        <div className={styles.app}>
          <main className={styles.mainContent}>
            <div className={styles.tabContent}>{renderTabContent()}</div>
          </main>
          <BottomNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
            pendingCount={2}
          />
        </div>
      </OrderUploadsProvider>
    </MapProviderProvider>
  );
}