import { useRef, useState, useEffect } from 'react';
import { X, Camera, Trash2, Image as ImageIcon, FileText, CheckCircle, MapPin } from 'lucide-react';
import { useOrderUploads, UploadDocument, AufstellProtocol } from '../../../contexts/OrderUploadsContext';
import { useOrders } from '../hooks/useOrders';
import { useUser } from '../../../contexts/UserContext';
import { LocationPickerModal } from './LocationPickerModal';
import styles from './DocumentUploadModal.module.scss';

interface DocumentUploadModalProps {
  orderId: string;
  onClose: () => void;
}

type ModalTab = 'documents' | 'protocol';
type PhotoSlotType = 'schild1' | 'schild2' | 'totale';

interface PhotoSlot {
  type: PhotoSlotType;
  label: string;
  document?: UploadDocument;
}

export function DocumentUploadModal({ orderId, onClose }: DocumentUploadModalProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [currentSlot, setCurrentSlot] = useState<PhotoSlotType | null>(null);
  const { orders } = useOrders();
  const { user } = useUser();
  const { getDocuments, addDocument, removeDocument, getProtocol, saveProtocol } = useOrderUploads();
  const [documents, setDocuments] = useState<UploadDocument[]>(getDocuments(orderId));
  const [activeTab, setActiveTab] = useState<ModalTab>('documents');
  const [geoLocation, setGeoLocation] = useState<string>('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Hole aktuelles Datum und Uhrzeit
  const getCurrentDateTime = () => {
    const now = new Date();
    const datum = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const uhrzeit = now.toTimeString().slice(0, 5); // HH:MM
    return { datum, uhrzeit };
  };

  const [protocol, setProtocol] = useState<AufstellProtocol>(() => {
    const existingProtocol = getProtocol(orderId);
    if (existingProtocol) return existingProtocol;

    const { datum, uhrzeit } = getCurrentDateTime();
    return {
      orderId,
      monteurName: user.name, // Vom Benutzerkonto
      datum,
      uhrzeit,
      standort: '', // Wird per GPS gefüllt
      anzahlSchilder: undefined,
      besonderheiten: '',
      unterschrift: ''
    };
  });

  const order = orders.find(o => o.id === orderId);
  const isZone = order?.isZone || false;

  // GPS-Position beim Laden der Komponente abrufen
  useEffect(() => {
    // Nur ausführen wenn noch kein Standort gesetzt ist
    if (protocol.standort) return;

    const useFallbackLocation = () => {
      if (order) {
        const fallbackLocation = `${order.location.street}, ${order.location.postalCode} ${order.location.city}`;
        setProtocol(prev => ({
          ...prev,
          standort: fallbackLocation
        }));
      }
    };

    // Check if geolocation is available and permissions policy allows it
    if ('geolocation' in navigator && 'permissions' in navigator) {
      // Try to get position silently with fallback
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setGeoLocation(locationString);
          setProtocol(prev => ({
            ...prev,
            standort: locationString
          }));
        },
        (error) => {
          // Silent fallback - don't log permission errors
          if (error.code === error.PERMISSION_DENIED) {
            console.log('GPS: Standortzugriff nicht erlaubt, verwende Auftragsadresse');
          } else {
            console.log('GPS nicht verfügbar, verwende Auftragsadresse');
          }
          useFallbackLocation();
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 300000 // Accept 5 minute old position
        }
      );
    } else {
      // GPS nicht verfügbar: Verwende Auftragsadresse
      useFallbackLocation();
    }
  }, [order]);

  // Definiere Foto-Slots basierend auf Zone oder einzelnes Schild
  const getPhotoSlots = (): PhotoSlot[] => {
    if (isZone) {
      // Zone: Schild 1, Schild 2, Totale
      return [
        { type: 'schild1', label: 'Schild 1' },
        { type: 'schild2', label: 'Schild 2' },
        { type: 'totale', label: 'Totale' },
      ];
    } else {
      // Einzelnes Schild: Schild 1, Totale
      return [
        { type: 'schild1', label: 'Schild 1' },
        { type: 'totale', label: 'Totale' },
      ];
    }
  };

  const photoSlots = getPhotoSlots().map(slot => ({
    ...slot,
    document: documents.find(doc => doc.slotType === slot.type)
  }));

  const allSlotsFilled = photoSlots.every(slot => slot.document !== undefined);
  
  // Check if protocol is complete
  const isProtocolComplete = !!(
    protocol.monteurName &&
    protocol.datum &&
    protocol.uhrzeit &&
    protocol.standort &&
    protocol.anzahlSchilder &&
    protocol.unterschrift
  );

  const handlePhotoCapture = (slotType: PhotoSlotType) => {
    setCurrentSlot(slotType);
    cameraInputRef.current?.click();
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || !currentSlot) return;

    const file = files[0]; // Nur ein Foto pro Slot
    const reader = new FileReader();
    reader.onload = (e) => {
      // Prüfe ob bereits ein Foto in diesem Slot existiert
      const existingDoc = documents.find(doc => doc.slotType === currentSlot);
      if (existingDoc) {
        removeDocument(orderId, existingDoc.id);
      }

      const newDocument: UploadDocument = {
        id: `doc-${orderId}-${currentSlot}-${Date.now()}`,
        orderId,
        type: 'photo',
        url: e.target?.result as string,
        thumbnail: e.target?.result as string,
        timestamp: new Date(),
        name: file.name,
        slotType: currentSlot
      };
      addDocument(orderId, newDocument);
      setDocuments(prev => {
        const filtered = prev.filter(doc => doc.slotType !== currentSlot);
        return [...filtered, newDocument];
      });
      setCurrentSlot(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (slotType: PhotoSlotType) => {
    const doc = documents.find(d => d.slotType === slotType);
    if (doc) {
      removeDocument(orderId, doc.id);
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
    }
  };

  const handleProtocolChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProtocol(prev => ({
      ...prev,
      [name]: name === 'anzahlSchilder' ? (value ? parseInt(value, 10) : undefined) : value
    }));
  };

  const handleProtocolSave = () => {
    saveProtocol(orderId, protocol);
    setActiveTab('documents');
  };

  const handleLocationConfirm = (location: string) => {
    setProtocol(prev => ({
      ...prev,
      standort: location
    }));
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Dokumente - Auftrag #{orderId}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.tabSection}>
          <button
            className={activeTab === 'documents' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('documents')}
          >
            Fotos
            {allSlotsFilled && (
              <span className={styles.tabBadgeGreen}>✓</span>
            )}
          </button>
          <button
            className={activeTab === 'protocol' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('protocol')}
          >
            Aufstellprotokoll
            {isProtocolComplete && (
              <span className={styles.tabBadgeGreen}>✓</span>
            )}
          </button>
        </div>

        {activeTab === 'documents' && (
          <>
            <div className={styles.documentsSection}>
              <div className={styles.photoSlotsGrid}>
                {photoSlots.map(slot => (
                  <div key={slot.type} className={styles.photoSlot}>
                    <div className={styles.slotLabel}>{slot.label}</div>
                    {slot.document ? (
                      <div className={styles.slotImage}>
                        <img src={slot.document.url} alt={slot.label} />
                        <button
                          className={styles.deleteSlotButton}
                          onClick={() => handleDelete(slot.type)}
                          title="Löschen"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className={styles.emptySlot}
                        onClick={() => handlePhotoCapture(slot.type)}
                      >
                        <Camera size={32} />
                        <span>Foto aufnehmen</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleFileUpload(e.target.files)}
              style={{ display: 'none' }}
            />
          </>
        )}

        {activeTab === 'protocol' && (
          <div className={styles.protocolSection}>
            <div className={styles.protocolField}>
              <label htmlFor="monteurName">Monteurname:</label>
              <input
                type="text"
                id="monteurName"
                name="monteurName"
                value={protocol.monteurName}
                disabled
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>
            <div className={styles.protocolField}>
              <label htmlFor="datum">Datum:</label>
              <input
                type="date"
                id="datum"
                name="datum"
                value={protocol.datum}
                onChange={handleProtocolChange}
              />
            </div>
            <div className={styles.protocolField}>
              <label htmlFor="uhrzeit">Uhrzeit:</label>
              <input
                type="time"
                id="uhrzeit"
                name="uhrzeit"
                value={protocol.uhrzeit}
                onChange={handleProtocolChange}
              />
            </div>
            <div className={styles.protocolField}>
              <label htmlFor="standort">Standort:</label>
              <div className={styles.locationInputGroup}>
                <input
                  type="text"
                  id="standort"
                  name="standort"
                  value={protocol.standort}
                  onChange={handleProtocolChange}
                  className={styles.locationInput}
                />
                <button
                  type="button"
                  className={styles.mapButton}
                  onClick={() => setShowLocationPicker(true)}
                  title="Auf Karte auswählen"
                >
                  <MapPin size={20} />
                </button>
              </div>
            </div>
            <div className={styles.protocolField}>
              <label htmlFor="anzahlSchilder">Anzahl Schilder:</label>
              <input
                type="number"
                id="anzahlSchilder"
                name="anzahlSchilder"
                value={protocol.anzahlSchilder || ''}
                onChange={handleProtocolChange}
                min="1"
              />
            </div>
            <div className={styles.protocolField}>
              <label htmlFor="besonderheiten">Besonderheiten:</label>
              <textarea
                id="besonderheiten"
                name="besonderheiten"
                value={protocol.besonderheiten}
                onChange={handleProtocolChange}
                rows={3}
              />
            </div>
            <div className={styles.protocolField}>
              <label htmlFor="unterschrift">Unterschrift:</label>
              <input
                type="text"
                id="unterschrift"
                name="unterschrift"
                value={protocol.unterschrift}
                onChange={handleProtocolChange}
                placeholder="Name des Unterzeichners"
              />
            </div>
            <button className={styles.saveProtocolButton} onClick={handleProtocolSave}>
              <CheckCircle size={20} />
              Protokoll speichern
            </button>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.count}>
            {documents.length} / {photoSlots.length} {documents.length === 1 ? 'Foto' : 'Fotos'}
            {allSlotsFilled && isProtocolComplete && (
              <span className={styles.completeBadge}>✓ Vollständig</span>
            )}
            {!allSlotsFilled && !isProtocolComplete && (
              <span className={styles.incompleteBadge}>Protokoll fehlt, Fotos fehlen</span>
            )}
            {allSlotsFilled && !isProtocolComplete && (
              <span className={styles.incompleteBadge}>Protokoll fehlt</span>
            )}
            {!allSlotsFilled && isProtocolComplete && (
              <span className={styles.incompleteBadge}>Fotos fehlen</span>
            )}
          </div>
          <button className={styles.doneButton} onClick={onClose}>
            Fertig
          </button>
        </div>
      </div>

      {showLocationPicker && (
        <LocationPickerModal
          initialLocation={protocol.standort}
          onConfirm={handleLocationConfirm}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </div>
  );
}