import { useActivityLog } from '../../../contexts/ActivityLogContext';
import { Trash2, Filter, Download } from 'lucide-react';
import { useState } from 'react';
import type { ActivityLogEntry } from '../../../contexts/ActivityLogContext';
import styles from './LogsView.module.scss';

export function LogsView(): JSX.Element {
  const { logs, clearLogs } = useActivityLog();
  const [filterCategory, setFilterCategory] = useState<ActivityLogEntry['category'] | 'all'>('all');

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    
    // Date: DD.MM.YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    // Time: HH:MM:SS,MS
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds},${milliseconds}`;
  };

  const getCategoryColor = (category: ActivityLogEntry['category']): string => {
    switch (category) {
      case 'navigation': return '#3c61bc';
      case 'order': return '#22c55e';
      case 'time': return '#eab308';
      case 'upload': return '#8b5cf6';
      case 'system': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryLabel = (category: ActivityLogEntry['category']): string => {
    switch (category) {
      case 'navigation': return 'Navigation';
      case 'order': return 'Auftrag';
      case 'time': return 'Zeit';
      case 'upload': return 'Upload';
      case 'system': return 'System';
      default: return 'Sonstiges';
    }
  };

  const filteredLogs = filterCategory === 'all' 
    ? logs 
    : logs.filter(log => log.category === filterCategory);

  const handleExport = () => {
    const csvContent = [
      'Timestamp,Datum,Uhrzeit,Kategorie,Aktion,Details',
      ...logs.map(log => {
        const date = new Date(log.timestamp);
        const dateStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
        const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')},${date.getMilliseconds().toString().padStart(3, '0')}`;
        return `${log.timestamp},"${dateStr}","${timeStr}","${getCategoryLabel(log.category)}","${log.action}","${log.details || ''}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activity-logs-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.logsContainer}>
      {/* Header Actions */}
      <div className={styles.logsHeader}>
        <div className={styles.logsTitle}>
          Aktivitätsprotokoll
          <span className={styles.logsCount}>({filteredLogs.length})</span>
        </div>
        <div className={styles.logsActions}>
          <button className={styles.actionButton} onClick={handleExport} title="Exportieren">
            <Download size={18} />
          </button>
          <button className={styles.actionButton} onClick={clearLogs} title="Alle löschen">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className={styles.categoryFilter}>
        <button
          className={`${styles.filterChip} ${filterCategory === 'all' ? styles.filterChipActive : ''}`}
          onClick={() => setFilterCategory('all')}
        >
          Alle
        </button>
        <button
          className={`${styles.filterChip} ${filterCategory === 'navigation' ? styles.filterChipActive : ''}`}
          onClick={() => setFilterCategory('navigation')}
        >
          Navigation
        </button>
        <button
          className={`${styles.filterChip} ${filterCategory === 'order' ? styles.filterChipActive : ''}`}
          onClick={() => setFilterCategory('order')}
        >
          Aufträge
        </button>
        <button
          className={`${styles.filterChip} ${filterCategory === 'time' ? styles.filterChipActive : ''}`}
          onClick={() => setFilterCategory('time')}
        >
          Zeit
        </button>
        <button
          className={`${styles.filterChip} ${filterCategory === 'upload' ? styles.filterChipActive : ''}`}
          onClick={() => setFilterCategory('upload')}
        >
          Upload
        </button>
        <button
          className={`${styles.filterChip} ${filterCategory === 'system' ? styles.filterChipActive : ''}`}
          onClick={() => setFilterCategory('system')}
        >
          System
        </button>
      </div>

      {/* Logs List */}
      <div className={styles.logsList}>
        {filteredLogs.length === 0 ? (
          <div className={styles.emptyState}>
            <Filter className={styles.emptyIcon} />
            <p className={styles.emptyText}>Keine Aktivitäten aufgezeichnet</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className={styles.logEntry}>
              <div className={styles.logHeader}>
                <div 
                  className={styles.logCategory}
                  style={{ backgroundColor: getCategoryColor(log.category) }}
                >
                  {getCategoryLabel(log.category)}
                </div>
                <div className={styles.logTimestamp}>
                  {formatTimestamp(log.timestamp)}
                </div>
              </div>
              <div className={styles.logAction}>{log.action}</div>
              {log.details && (
                <div className={styles.logDetails}>{log.details}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
