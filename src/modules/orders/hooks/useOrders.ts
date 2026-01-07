import { useState, useEffect, useCallback } from 'react';
import type { OrderDto, OrderFilters } from '../types';
import { orderService } from '../services/orderService';

interface UseOrdersResult {
  orders: OrderDto[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useOrders(filters?: OrderFilters): UseOrdersResult {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderService.fetchOrders(filters);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
  };
}
