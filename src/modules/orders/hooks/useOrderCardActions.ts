import { useState } from 'react';
import { useOrderUploads } from '../../../contexts/OrderUploadsContext';

interface OrderCardActionsReturn {
  showDocumentModal: boolean;
  showMessageModal: boolean;
  documentCount: number;
  isCompleted: boolean;
  setShowDocumentModal: (show: boolean) => void;
  setShowMessageModal: (show: boolean) => void;
  handleMessageClick: (e: React.MouseEvent) => void;
  handleDocumentClick: (e: React.MouseEvent) => void;
  handleCompleteOrder: (e: React.MouseEvent, orderId: string) => void;
}

export function useOrderCardActions(orderId: string): OrderCardActionsReturn {
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const { getDocuments, completeOrder, isOrderCompleted } = useOrderUploads();

  const documentCount = getDocuments(orderId).length;
  const isCompleted = isOrderCompleted(orderId);

  const handleMessageClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setShowMessageModal(true);
  };

  const handleDocumentClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setShowDocumentModal(true);
  };

  const handleCompleteOrder = (e: React.MouseEvent, id: string): void => {
    e.stopPropagation();
    completeOrder(id);
  };

  return {
    showDocumentModal,
    showMessageModal,
    documentCount,
    isCompleted,
    setShowDocumentModal,
    setShowMessageModal,
    handleMessageClick,
    handleDocumentClick,
    handleCompleteOrder,
  };
}
