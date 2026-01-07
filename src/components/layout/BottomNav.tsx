import { ClipboardList, Package, User, BookOpen } from 'lucide-react';
import styles from './BottomNav.module.scss';

type NavTab = 'orders' | 'material' | 'infos' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingCount?: number;
}

export function BottomNav({
  activeTab,
  onTabChange,
  pendingCount = 0,
}: BottomNavProps): JSX.Element {
  return (
    <nav className={styles.bottomNav}>
      <button
        className={`${styles.navItem} ${
          activeTab === 'orders' ? styles.navItemActive : ''
        }`}
        onClick={() => onTabChange('orders')}
        aria-label="Aufträge"
      >
        <ClipboardList className={styles.navIcon} />
        <span className={styles.navLabel}>Aufträge</span>
      </button>

      <button
        className={`${styles.navItem} ${
          activeTab === 'material' ? styles.navItemActive : ''
        }`}
        onClick={() => onTabChange('material')}
        aria-label="Material"
      >
        <Package className={styles.navIcon} />
        <span className={styles.navLabel}>Material</span>
      </button>

      <button
        className={`${styles.navItem} ${
          activeTab === 'infos' ? styles.navItemActive : ''
        }`}
        onClick={() => onTabChange('infos')}
        aria-label="Infos"
      >
        <BookOpen className={styles.navIcon} />
        <span className={styles.navLabel}>Infos</span>
      </button>

      <button
        className={`${styles.navItem} ${
          activeTab === 'profile' ? styles.navItemActive : ''
        }`}
        onClick={() => onTabChange('profile')}
        aria-label="Profil"
      >
        <User className={styles.navIcon} />
        <span className={styles.navLabel}>Profil</span>
      </button>
    </nav>
  );
}