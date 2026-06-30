import { useState } from 'react';
import { X, MapPin, Check, Search, Loader2, AlertCircle } from 'lucide-react';
import { MapTab } from './MapTab';
import { geocodingService, GeocodingResult } from '../../../services/geocodingService';
import styles from './LocationPickerModal.module.scss';

interface LocationPickerModalProps {
  initialLocation: string;
  onConfirm: (location: string) => void;
  onClose: () => void;
}

export function LocationPickerModal({ initialLocation, onConfirm, onClose }: LocationPickerModalProps) {
  const [location, setLocation] = useState(initialLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lon: number } | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      const results = await geocodingService.searchAddress(searchQuery);
      setSearchResults(results);

      if (results.length === 0) {
        setSearchError('Keine Ergebnisse gefunden. Versuchen Sie eine andere Adresse.');
      }
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Fehler bei der Suche');
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultSelect = (result: GeocodingResult) => {
    const coordinates = geocodingService.formatCoordinates(result.lat, result.lon);
    setLocation(coordinates);
    setSelectedCoords({ lat: result.lat, lon: result.lon });
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleConfirm = () => {
    onConfirm(location);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Standort auswählen</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.searchSection}>
            <div className={styles.searchInputGroup}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Adresse suchen (z.B. Musterstraße 1, Berlin)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className={styles.searchButton}
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
              >
                {isSearching ? <Loader2 size={20} className={styles.spinner} /> : 'Suchen'}
              </button>
            </div>

            {searchError && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                <span>{searchError}</span>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className={styles.resultsContainer}>
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    className={styles.resultItem}
                    onClick={() => handleResultSelect(result)}
                  >
                    <MapPin size={16} className={styles.resultIcon} />
                    <span className={styles.resultText}>{result.displayName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.inputSection}>
            <MapPin size={20} className={styles.icon} />
            <input
              type="text"
              className={styles.locationInput}
              placeholder="GPS-Koordinaten (z.B. 52.520008, 13.404954)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className={styles.mapSection}>
            <MapTab orders={[]} centerCoords={selectedCoords} />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Abbrechen
          </button>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            <Check size={20} />
            Übernehmen
          </button>
        </div>
      </div>
    </div>
  );
}
