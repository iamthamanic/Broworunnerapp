import { useState } from 'react';
import { CheckCircle, PackageCheck, X } from 'lucide-react';
import { ImageWithFallback } from '../../../app/components/figma/ImageWithFallback';
import type { BaustelleMaterial } from '../types';
import styles from './MaterialInventorySection.module.scss';

interface MaterialState {
  istMenge: string;
  confirmed: boolean;
}

interface MaterialInventorySectionProps {
  materials: BaustelleMaterial[];
}

export function MaterialInventorySection({ materials }: MaterialInventorySectionProps): JSX.Element {
  const [state, setState] = useState<Record<string, MaterialState>>(
    () => Object.fromEntries(materials.map(m => [m.id, { istMenge: '', confirmed: false }]))
  );
  const [zoomedMaterial, setZoomedMaterial] = useState<BaustelleMaterial | null>(null);

  const handleInput = (id: string, value: string): void => {
    setState(prev => ({ ...prev, [id]: { ...prev[id], istMenge: value } }));
  };

  const handleConfirm = (id: string): void => {
    setState(prev => ({ ...prev, [id]: { ...prev[id], confirmed: true } }));
  };

  const handleEdit = (id: string): void => {
    setState(prev => ({ ...prev, [id]: { ...prev[id], confirmed: false } }));
  };

  const confirmedCount = Object.values(state).filter(s => s.confirmed).length;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <PackageCheck size={15} className={styles.sectionIcon} />
        <span className={styles.sectionTitle}>Materialien</span>
        <span className={styles.progress}>{confirmedCount}/{materials.length}</span>
      </div>

      <div className={styles.list}>
        {materials.map(material => {
          const s = state[material.id];
          const isValid = s.istMenge !== '' && !isNaN(Number(s.istMenge)) && Number(s.istMenge) >= 0;

          return (
            <div key={material.id} className={`${styles.row} ${s.confirmed ? styles.rowConfirmed : ''}`}>
              <div className={styles.materialInfo}>
                {material.imageUrl && (
                  <button
                    className={styles.thumbnail}
                    onClick={e => { e.stopPropagation(); setZoomedMaterial(material); }}
                    aria-label={`${material.name} vergrößern`}
                  >
                    <ImageWithFallback src={material.imageUrl} alt={material.name} />
                  </button>
                )}
                <span className={styles.materialName}>{material.name}</span>
                <span className={styles.sollBadge}>
                  Soll: {material.sollMenge} {material.unit}
                </span>
              </div>

              {s.confirmed ? (
                <div className={styles.confirmedState}>
                  <span className={styles.istValue}>
                    Ist: <strong>{s.istMenge}</strong> {material.unit}
                  </span>
                  <button className={styles.editButton} onClick={() => handleEdit(material.id)}>
                    Ändern
                  </button>
                  <CheckCircle size={16} className={styles.checkIcon} />
                </div>
              ) : (
                <div className={styles.inputRow}>
                  <input
                    type="number"
                    min="0"
                    className={styles.istInput}
                    placeholder="Ist"
                    value={s.istMenge}
                    onChange={e => handleInput(material.id, e.target.value)}
                    onClick={e => e.stopPropagation()}
                  />
                  <span className={styles.unit}>{material.unit}</span>
                  <button
                    className={styles.confirmButton}
                    disabled={!isValid}
                    onClick={e => { e.stopPropagation(); handleConfirm(material.id); }}
                  >
                    OK
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {zoomedMaterial && zoomedMaterial.imageUrl && (
        <div className={styles.lightbox} onClick={() => setZoomedMaterial(null)}>
          <button className={styles.lightboxClose} aria-label="Schließen">
            <X size={22} />
          </button>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <ImageWithFallback src={zoomedMaterial.imageUrl} alt={zoomedMaterial.name} />
            <span className={styles.lightboxCaption}>{zoomedMaterial.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
