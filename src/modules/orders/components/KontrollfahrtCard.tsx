import { Navigation } from 'lucide-react';
import { UniversalOrderCard } from './UniversalOrderCard';
import type { OrderDto } from '../types';

interface KontrollfahrtCardProps {
  order: OrderDto;
  orderIndex: number;
  isLastOrder: boolean;
  onClick?: (order: OrderDto) => void;
}

export function KontrollfahrtCard(props: KontrollfahrtCardProps): JSX.Element {
  return (
    <UniversalOrderCard
      {...props}
      config={{
        variant: 'kontrollfahrt',
        icon: Navigation,
        label: 'Kontrollfahrt',
      }}
    />
  );
}
