import { LogOut, Zap } from 'lucide-react';
import styles from './TopBar.module.scss';

interface TopBarProps {
  onLogout?: () => void;
}

export function TopBar({ onLogout }: TopBarProps): JSX.Element {
  return (
    <div className={styles.topBar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Zap size={20} />
        </div>
        <span className={styles.logoText}>Browo Runner</span>
      </div>
      <button className={styles.logoutButton} onClick={onLogout} title="Abmelden">
        <LogOut size={18} />
      </button>
    </div>
  );
}