import { Plus } from 'lucide-react';
import styles from './QuickActionButton.module.scss';

interface QuickActionButtonProps {
  onClick: () => void;
  badge?: number;
  pulse?: boolean;
}

export function QuickActionButton({
  onClick,
  badge,
  pulse = false,
}: QuickActionButtonProps): JSX.Element {
  return (
    <button
      className={`${styles.quickActionButton} ${pulse ? styles.pulse : ''}`}
      onClick={onClick}
      aria-label="Schnellaktion"
    >
      {badge !== undefined && badge > 0 && (
        <span className={styles.badge}>{badge}</span>
      )}
      <Plus size={24} />
    </button>
  );
}
