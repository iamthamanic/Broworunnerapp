import { createContext, useContext, useState, ReactNode } from 'react';

export interface UploadDocument {
  id: string;
  orderId: string;
  type: 'photo' | 'document';
  url: string;
  thumbnail?: string;
  timestamp: Date;
  name: string;
  slotType?: 'schild1' | 'schild2' | 'totale'; // Für vordefinierte Foto-Slots
}

export interface OrderSketch {
  id: string;
  orderId: string;
  dataUrl: string;
  timestamp: Date;
}

export interface AufstellProtocol {
  orderId: string;
  monteurName?: string;
  datum?: string;
  uhrzeit?: string;
  standort?: string;
  anzahlSchilder?: number;
  besonderheiten?: string;
  unterschrift?: string;
  completedAt?: Date;
}

interface OrderUploadsContextType {
  documents: Record<string, UploadDocument[]>;
  sketches: Record<string, OrderSketch>;
  protocols: Record<string, AufstellProtocol>;
  completedOrders: Set<string>;
  addDocument: (orderId: string, document: UploadDocument) => void;
  removeDocument: (orderId: string, documentId: string) => void;
  getDocuments: (orderId: string) => UploadDocument[];
  getPhotoCount: (orderId: string) => number;
  saveSketch: (orderId: string, dataUrl: string) => void;
  getSketch: (orderId: string) => OrderSketch | undefined;
  deleteSketch: (orderId: string) => void;
  saveProtocol: (orderId: string, protocol: AufstellProtocol) => void;
  getProtocol: (orderId: string) => AufstellProtocol | undefined;
  isProtocolComplete: (orderId: string) => boolean;
  canCompleteOrder: (orderId: string, isZone?: boolean) => boolean;
  areAllPhotoSlotsFilled: (orderId: string, isZone?: boolean) => boolean;
  completeOrder: (orderId: string) => void;
  uncompleteOrder: (orderId: string) => void;
  isOrderCompleted: (orderId: string) => boolean;
}

const OrderUploadsContext = createContext<OrderUploadsContextType | undefined>(undefined);

export function OrderUploadsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Record<string, UploadDocument[]>>({});
  const [sketches, setSketches] = useState<Record<string, OrderSketch>>({});
  const [protocols, setProtocols] = useState<Record<string, AufstellProtocol>>({});
  const [completedOrders, setCompletedOrders] = useState<Set<string>>(new Set());

  const addDocument = (orderId: string, document: UploadDocument) => {
    setDocuments(prev => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), document]
    }));
  };

  const removeDocument = (orderId: string, documentId: string) => {
    setDocuments(prev => {
      const newDocs = {
        ...prev,
        [orderId]: (prev[orderId] || []).filter(doc => doc.id !== documentId)
      };
      
      // Auto-uncomplete wird jetzt durch areAllPhotoSlotsFilled gehandhabt
      // Die Prüfung erfolgt in canCompleteOrder
      if (completedOrders.has(orderId)) {
        setCompletedOrders(current => {
          const newSet = new Set(current);
          newSet.delete(orderId);
          return newSet;
        });
      }
      
      return newDocs;
    });
  };

  const getDocuments = (orderId: string) => {
    return documents[orderId] || [];
  };

  const getPhotoCount = (orderId: string) => {
    return (documents[orderId] || []).filter(doc => doc.type === 'photo').length;
  };

  const saveSketch = (orderId: string, dataUrl: string) => {
    setSketches(prev => ({
      ...prev,
      [orderId]: {
        id: `sketch-${orderId}-${Date.now()}`,
        orderId,
        dataUrl,
        timestamp: new Date()
      }
    }));
  };

  const getSketch = (orderId: string) => {
    return sketches[orderId];
  };

  const deleteSketch = (orderId: string) => {
    setSketches(prev => {
      const newSketches = { ...prev };
      delete newSketches[orderId];
      return newSketches;
    });
  };

  const saveProtocol = (orderId: string, protocol: AufstellProtocol) => {
    setProtocols(prev => {
      const newProtocols = {
        ...prev,
        [orderId]: protocol
      };
      
      // Auto-uncomplete if protocol becomes incomplete
      const isComplete = !!protocol.monteurName && !!protocol.datum && !!protocol.uhrzeit && 
                         !!protocol.standort && protocol.anzahlSchilder !== undefined && 
                         !!protocol.unterschrift;
      
      if (!isComplete && completedOrders.has(orderId)) {
        setCompletedOrders(current => {
          const newSet = new Set(current);
          newSet.delete(orderId);
          return newSet;
        });
      }
      
      return newProtocols;
    });
  };

  const getProtocol = (orderId: string) => {
    return protocols[orderId];
  };

  const isProtocolComplete = (orderId: string) => {
    const protocol = protocols[orderId];
    if (!protocol) return false;
    
    return !!protocol.monteurName && 
           !!protocol.datum && 
           !!protocol.uhrzeit && 
           !!protocol.standort && 
           protocol.anzahlSchilder !== undefined && 
           !!protocol.unterschrift;
  };

  const canCompleteOrder = (orderId: string, isZone?: boolean) => {
    return areAllPhotoSlotsFilled(orderId, isZone) && isProtocolComplete(orderId);
  };

  const areAllPhotoSlotsFilled = (orderId: string, isZone?: boolean) => {
    const docs = documents[orderId] || [];
    const photoDocs = docs.filter(doc => doc.type === 'photo');
    
    const hasSchild1 = photoDocs.some(doc => doc.slotType === 'schild1');
    const hasSchild2 = photoDocs.some(doc => doc.slotType === 'schild2');
    const hasTotale = photoDocs.some(doc => doc.slotType === 'totale');
    
    if (isZone) {
      // Zone: Schild 1, Schild 2, Totale (alle 3 müssen befüllt sein)
      return hasSchild1 && hasSchild2 && hasTotale;
    } else {
      // Einzelnes Schild: Schild 1, Totale (beide müssen befüllt sein)
      return hasSchild1 && hasTotale;
    }
  };

  const completeOrder = (orderId: string) => {
    setCompletedOrders(prev => new Set([...prev, orderId]));
  };

  const uncompleteOrder = (orderId: string) => {
    setCompletedOrders(prev => {
      const newSet = new Set(prev);
      newSet.delete(orderId);
      return newSet;
    });
  };

  const isOrderCompleted = (orderId: string) => {
    return completedOrders.has(orderId);
  };

  return (
    <OrderUploadsContext.Provider
      value={{
        documents,
        sketches,
        protocols,
        completedOrders,
        addDocument,
        removeDocument,
        getDocuments,
        getPhotoCount,
        saveSketch,
        getSketch,
        deleteSketch,
        saveProtocol,
        getProtocol,
        isProtocolComplete,
        canCompleteOrder,
        areAllPhotoSlotsFilled,
        completeOrder,
        uncompleteOrder,
        isOrderCompleted
      }}
    >
      {children}
    </OrderUploadsContext.Provider>
  );
}

export function useOrderUploads() {
  const context = useContext(OrderUploadsContext);
  if (!context) {
    throw new Error('useOrderUploads must be used within OrderUploadsProvider');
  }
  return context;
}