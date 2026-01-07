import { Wrench } from 'lucide-react';
import { UniversalOrderCard } from './UniversalOrderCard';
import type { OrderDto } from '../types';

interface BaustelleCardProps {
  order: OrderDto;
  orderIndex: number;
  isLastOrder: boolean;
  onClick?: (order: OrderDto) => void;
}

export function BaustelleCard(props: BaustelleCardProps): JSX.Element {
  const getJobTypeLabel = (): string => {
    switch (props.order.jobType) {
      case 'road-closure':
        return 'Straßensperrung';
      case 'traffic-safety':
        return 'Verkehrssicherung';
      case 'construction-site':
        return 'Baustelleneinrichtung';
      default:
        return 'Baustelle';
    }
  };

  return (
    <UniversalOrderCard
      {...props}
      config={{
        variant: 'baustelle',
        icon: Wrench,
        label: getJobTypeLabel(),
      }}
    />
  );
}
