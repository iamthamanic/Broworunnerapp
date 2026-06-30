import { useState } from 'react';
import { Package, Sticker, Triangle, MoreHorizontal, Search, Download, FileText, X, ChevronRight } from 'lucide-react';
import { TopBar } from '../../profile/components/TopBar';
import styles from './MaterialView.module.scss';

type MaterialTab = 'sticker' | 'schilder' | 'sonstiges';

interface StickerItem {
  id: string;
  name: string;
  fileName: string;
  fileSize: string;
  pdfUrl: string;
  uploadDate: string;
}

interface StockEntry {
  warehouse: string;
  count: number;
}

interface SchildItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  info: string;
  stock: StockEntry[];
}

interface SonstigesItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
  unit: string;
  location?: string;
  detailInfo?: string;
}

const mockSticker: StickerItem[] = [
  { 
    id: '1', 
    name: 'Halteverbotsaufkleber Vorlage', 
    fileName: 'halteverbot_vorlage.pdf',
    fileSize: '245 KB',
    pdfUrl: '#',
    uploadDate: '15.12.2024'
  },
  { 
    id: '2', 
    name: 'Warn-Aufkleber Spezifikation', 
    fileName: 'warn_aufkleber_specs.pdf',
    fileSize: '180 KB',
    pdfUrl: '#',
    uploadDate: '10.12.2024'
  },
  { 
    id: '3', 
    name: 'Richtungspfeile Montageanleitung', 
    fileName: 'richtungspfeile_montage.pdf',
    fileSize: '320 KB',
    pdfUrl: '#',
    uploadDate: '05.12.2024'
  },
  { 
    id: '4', 
    name: 'Reflexfolie Dokumentation', 
    fileName: 'reflexfolie_doku.pdf',
    fileSize: '410 KB',
    pdfUrl: '#',
    uploadDate: '01.12.2024'
  },
];

const mockSchilder: SchildItem[] = [
  {
    id: '1',
    name: 'Halteverbot (Zeichen 283)',
    description: 'Absolutes Halteverbot',
    imageUrl: 'https://images.unsplash.com/photo-1586694680938-d95c921c4f3e?w=400',
    category: 'Verkehrszeichen',
    info: 'StVO Zeichen 283 - Absolutes Halteverbot. Gilt nur auf der Straßenseite, auf der das Zeichen steht.',
    stock: [
      { warehouse: 'Lager A', count: 24 },
      { warehouse: 'Lager B', count: 8 },
      { warehouse: 'Lager C', count: 0 },
    ]
  },
  {
    id: '2',
    name: 'Baustellenschild (123)',
    description: 'Baustelle - Gefahrenzeichen',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    category: 'Gefahrenzeichen',
    info: 'Warnt vor einer Baustelle auf der Fahrbahn. Aufstellung in der Regel 150-250m vor der Gefahrenstelle.',
    stock: [
      { warehouse: 'Lager A', count: 6 },
      { warehouse: 'Lager B', count: 14 },
      { warehouse: 'Lager C', count: 3 },
    ]
  },
  {
    id: '3',
    name: 'Umleitungsschild (454)',
    description: 'Umleitung - Vorwegweiser',
    imageUrl: 'https://images.unsplash.com/photo-1621274790572-7c32596bc67f?w=400',
    category: 'Wegweiser',
    info: 'Zeigt Umleitungsstrecken bei gesperrten Straßen an. Nummerierung U1-U99.',
    stock: [
      { warehouse: 'Lager A', count: 0 },
      { warehouse: 'Lager B', count: 11 },
      { warehouse: 'Lager C', count: 5 },
    ]
  },
  {
    id: '4',
    name: 'Geschwindigkeitsbegrenzung (274)',
    description: 'Zulässige Höchstgeschwindigkeit',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400',
    category: 'Verkehrszeichen',
    info: 'Zeichen 274 - Zulässige Höchstgeschwindigkeit. In verschiedenen km/h-Stufen verfügbar.',
    stock: [
      { warehouse: 'Lager A', count: 18 },
      { warehouse: 'Lager B', count: 0 },
      { warehouse: 'Lager C', count: 7 },
    ]
  },
];

const mockSonstiges: SonstigesItem[] = [
  { 
    id: '1', 
    name: 'Leitkegel (Pylone)', 
    description: 'Rot-weiße Leitkegel zur Fahrbahnabsperrung',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    quantity: 40, 
    unit: 'Stück', 
    location: 'Lager B',
    detailInfo: 'Standardmäßig 75cm hohe Leitkegel aus robustem Kunststoff. Reflektierende Streifen für bessere Sichtbarkeit. Stapelbar und wetterbeständig. Einsetzbar als temporäre Absperrung oder Fahrbahnmarkierung.'
  },
  { 
    id: '2', 
    name: 'Absperrband', 
    description: 'Rot-weißes Warnband für Absperrungen',
    imageUrl: 'https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=400',
    quantity: 200, 
    unit: 'Meter', 
    location: 'Lager A',
    detailInfo: 'Reißfestes Polyethylen-Absperrband mit rot-weißer Kennzeichnung. Breite: 8cm. Geeignet für Baustellen, Gefahrenbereiche und temporäre Absperrungen. Witterungsbeständig und UV-resistent.'
  },
  { 
    id: '3', 
    name: 'Warnleuchten', 
    description: 'LED-Warnleuchten batteriebetrieben',
    imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400',
    quantity: 18, 
    unit: 'Stück', 
    location: 'Lager C',
    detailInfo: 'Batteriebetriebene LED-Warnleuchten mit orangefarbenem Blinklicht. Laufzeit bis zu 200 Stunden. Magnetfuß für einfache Befestigung. Wasserdicht nach IP65. Ideal für Nacht- und Dämmerungsarbeiten.'
  },
  { 
    id: '4', 
    name: 'Schilderständer', 
    description: 'Mobile Ständer für Verkehrszeichen',
    imageUrl: 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=400',
    quantity: 35, 
    unit: 'Stück', 
    location: 'Lager B',
    detailInfo: 'Klappbare Schilderständer aus verzinktem Stahl. Geeignet für Verkehrszeichen bis 90cm Durchmesser. Windfest durch Gummifüße und optionale Gewichtsplatten. Schnelle Montage ohne Werkzeug.'
  },
];

export function MaterialView(): JSX.Element {
  const [activeTab, setActiveTab] = useState<MaterialTab>('sticker');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchild, setSelectedSchild] = useState<SchildItem | null>(null);
  const [selectedSonstiges, setSelectedSonstiges] = useState<SonstigesItem | null>(null);

  const filterSticker = (items: StickerItem[]): StickerItem[] => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.fileName.toLowerCase().includes(query)
    );
  };

  const filterSchilder = (items: SchildItem[]): SchildItem[] => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.info.toLowerCase().includes(query)
    );
  };

  const filterSonstiges = (items: SonstigesItem[]): SonstigesItem[] => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      (item.location && item.location.toLowerCase().includes(query))
    );
  };

  const getTabIcon = (tab: MaterialTab) => {
    switch (tab) {
      case 'sticker':
        return <Sticker size={18} />;
      case 'schilder':
        return <Triangle size={18} />;
      case 'sonstiges':
        return <MoreHorizontal size={18} />;
    }
  };

  const renderContent = () => {
    if (activeTab === 'sticker') {
      const filtered = filterSticker(mockSticker);
      return (
        <div className={styles.contentGrid}>
          {filtered.map((item) => (
            <div key={item.id} className={styles.pdfCard}>
              <div className={styles.pdfIcon}>
                <FileText size={32} />
              </div>
              <div className={styles.pdfContent}>
                <h3 className={styles.pdfName}>{item.name}</h3>
                <p className={styles.pdfFileName}>{item.fileName}</p>
                <div className={styles.pdfMeta}>
                  <span>{item.fileSize}</span>
                  <span>•</span>
                  <span>{item.uploadDate}</span>
                </div>
              </div>
              <button className={styles.downloadButton} aria-label="PDF herunterladen">
                <Download size={20} />
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'schilder') {
      const filtered = filterSchilder(mockSchilder);
      return (
        <div className={styles.schildList}>
          {filtered.map((item) => (
            <div 
              key={item.id} 
              className={styles.schildListItem}
              onClick={() => setSelectedSchild(item)}
            >
              <div className={styles.schildThumbnail}>
                <img src={item.imageUrl} alt={item.name} />
              </div>
              <div className={styles.schildListContent}>
                <h3 className={styles.schildListName}>{item.name}</h3>
                <p className={styles.schildListCategory}>{item.category}</p>
              </div>
              <ChevronRight className={styles.schildChevron} size={20} />
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'sonstiges') {
      const filtered = filterSonstiges(mockSonstiges);
      return (
        <div className={styles.schildList}>
          {filtered.map((item) => (
            <div 
              key={item.id} 
              className={styles.schildListItem}
              onClick={() => setSelectedSonstiges(item)}
            >
              <div className={styles.schildThumbnail}>
                <img src={item.imageUrl} alt={item.name} />
              </div>
              <div className={styles.schildListContent}>
                <h3 className={styles.schildListName}>{item.name}</h3>
                <p className={styles.schildListCategory}>
                  {item.quantity} {item.unit} {item.location && `• ${item.location}`}
                </p>
              </div>
              <ChevronRight className={styles.schildChevron} size={20} />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className={styles.materialView}>
      <TopBar onLogout={() => console.log('Logout')} />
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Material durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === 'sticker' ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab('sticker')}
          >
            {getTabIcon('sticker')}
            <span>Sticker</span>
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === 'schilder' ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab('schilder')}
          >
            {getTabIcon('schilder')}
            <span>Schilder</span>
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === 'sonstiges' ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab('sonstiges')}
          >
            {getTabIcon('sonstiges')}
            <span>Sonstiges</span>
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {renderContent()}
      </div>

      {selectedSchild && (
        <div className={styles.modal} onClick={() => setSelectedSchild(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.modalClose}
              onClick={() => setSelectedSchild(null)}
              aria-label="Schließen"
            >
              <X size={24} />
            </button>

            <div className={styles.modalImage}>
              <img src={selectedSchild.imageUrl} alt={selectedSchild.name} />
            </div>

            <div className={styles.modalBody}>
              <span className={styles.modalCategory}>{selectedSchild.category}</span>
              <h2 className={styles.modalTitle}>{selectedSchild.name}</h2>
              <p className={styles.modalDescription}>{selectedSchild.description}</p>
              
              <div className={styles.modalInfoSection}>
                <h3 className={styles.modalInfoTitle}>Lagerbestand</h3>
                <div className={styles.inventoryList}>
                  {selectedSchild.stock.map((entry) => (
                    <div key={entry.warehouse} className={styles.inventoryRow}>
                      <span className={styles.inventoryWarehouse}>{entry.warehouse}</span>
                      <span className={`${styles.inventoryBadge} ${entry.count === 0 ? styles.inventoryBadgeEmpty : entry.count <= 5 ? styles.inventoryBadgeLow : styles.inventoryBadgeOk}`}>
                        {entry.count === 0 ? 'Nicht verfügbar' : `${entry.count} Stück`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.modalInfoSection}>
                <h3 className={styles.modalInfoTitle}>Detaillierte Informationen</h3>
                <p className={styles.modalInfo}>{selectedSchild.info}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSonstiges && (
        <div className={styles.modal} onClick={() => setSelectedSonstiges(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.modalClose}
              onClick={() => setSelectedSonstiges(null)}
              aria-label="Schließen"
            >
              <X size={24} />
            </button>

            <div className={styles.modalImage}>
              <img src={selectedSonstiges.imageUrl} alt={selectedSonstiges.name} />
            </div>

            <div className={styles.modalBody}>
              <h2 className={styles.modalTitle}>{selectedSonstiges.name}</h2>
              <p className={styles.modalDescription}>{selectedSonstiges.description}</p>
              
              <div className={styles.sonstigesModalMeta}>
                <div className={styles.sonstigesMetaItem}>
                  <span className={styles.sonstigesMetaLabel}>Bestand:</span>
                  <span className={styles.sonstigesMetaValue}>
                    {selectedSonstiges.quantity} {selectedSonstiges.unit}
                  </span>
                </div>
                {selectedSonstiges.location && (
                  <div className={styles.sonstigesMetaItem}>
                    <span className={styles.sonstigesMetaLabel}>Lagerort:</span>
                    <span className={styles.sonstigesMetaValue}>{selectedSonstiges.location}</span>
                  </div>
                )}
              </div>

              {selectedSonstiges.detailInfo && (
                <div className={styles.modalInfoSection}>
                  <h3 className={styles.modalInfoTitle}>Detaillierte Informationen</h3>
                  <p className={styles.modalInfo}>{selectedSonstiges.detailInfo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}