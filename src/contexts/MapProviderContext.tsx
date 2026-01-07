import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { OpenStreetMapProvider } from '../services/map/OpenStreetMapProvider';
import type { IMapProvider, MapProviderType } from '../services/map/types';

interface MapProviderContextType {
  provider: IMapProvider;
  providerType: MapProviderType;
  setProviderType: (type: MapProviderType) => void;
}

const MapProviderContext = createContext<MapProviderContextType | undefined>(undefined);

/**
 * Factory to create map provider instances
 * Easy to extend with new providers (Google Maps, Mapbox, HERE, etc.)
 */
function createMapProvider(type: MapProviderType): IMapProvider {
  switch (type) {
    case 'openstreetmap':
      return new OpenStreetMapProvider();
    
    // Easy to add new providers:
    // case 'google':
    //   return new GoogleMapsProvider(apiKey);
    // case 'mapbox':
    //   return new MapboxProvider(apiKey);
    // case 'here':
    //   return new HEREMapsProvider(apiKey);
    
    default:
      return new OpenStreetMapProvider();
  }
}

interface MapProviderProviderProps {
  children: ReactNode;
  defaultProvider?: MapProviderType;
}

export function MapProviderProvider({ 
  children, 
  defaultProvider = 'openstreetmap' 
}: MapProviderProviderProps) {
  const [providerType, setProviderType] = useState<MapProviderType>(defaultProvider);

  const provider = useMemo(() => createMapProvider(providerType), [providerType]);

  return (
    <MapProviderContext.Provider
      value={{
        provider,
        providerType,
        setProviderType,
      }}
    >
      {children}
    </MapProviderContext.Provider>
  );
}

export function useMapProvider() {
  const context = useContext(MapProviderContext);
  if (!context) {
    throw new Error('useMapProvider must be used within MapProviderProvider');
  }
  return context;
}
