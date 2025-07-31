import React from 'react';
import { Clock, CheckCircle, XCircle, Package, Truck, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type OrderStatusType = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'rejected';

interface OrderStatusProps {
  status: OrderStatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const OrderStatus: React.FC<OrderStatusProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className
}) => {
  const getStatusConfig = (status: OrderStatusType) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          icon: Clock,
          variant: 'secondary' as const,
          color: 'text-warning'
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          icon: CheckCircle,
          variant: 'default' as const,
          color: 'text-primary'
        };
      case 'preparing':
        return {
          label: 'Preparing',
          icon: Package,
          variant: 'default' as const,
          color: 'text-primary'
        };
      case 'ready':
        return {
          label: 'Ready',
          icon: CheckCircle,
          variant: 'default' as const,
          color: 'text-success'
        };
      case 'out_for_delivery':
        return {
          label: 'Out for Delivery',
          icon: Truck,
          variant: 'default' as const,
          color: 'text-primary'
        };
      case 'delivered':
        return {
          label: 'Delivered',
          icon: CheckCircle,
          variant: 'default' as const,
          color: 'text-success'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          icon: XCircle,
          variant: 'destructive' as const,
          color: 'text-destructive'
        };
      default:
        return {
          label: 'Unknown',
          icon: AlertCircle,
          variant: 'secondary' as const,
          color: 'text-muted-foreground'
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        'flex items-center space-x-1',
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <IconComponent className={cn(iconSizes[size], config.color)} />
      )}
      <span>{config.label}</span>
    </Badge>
  );
};

export default OrderStatus;

// Additional component for status timeline
interface OrderStatusTimelineProps {
  currentStatus: OrderStatusType;
  deliveryRequired?: boolean;
  className?: string;
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  currentStatus,
  deliveryRequired = false,
  className
}) => {
  const getStatusList = (deliveryRequired: boolean): OrderStatusType[] => {
    const baseStatuses: OrderStatusType[] = ['pending', 'confirmed', 'preparing'];
    
    if (deliveryRequired) {
      return [...baseStatuses, 'ready', 'out_for_delivery', 'delivered'];
    } else {
      return [...baseStatuses, 'ready'];
    }
  };

  const statuses = getStatusList(deliveryRequired);
  const currentIndex = statuses.indexOf(currentStatus);

  const getStatusConfig = (status: OrderStatusType) => {
    switch (status) {
      case 'pending':
        return { label: 'Order Placed', icon: Clock };
      case 'confirmed':
        return { label: 'Confirmed', icon: CheckCircle };
      case 'preparing':
        return { label: 'Preparing', icon: Package };
      case 'ready':
        return { 
          label: deliveryRequired ? 'Ready for Delivery' : 'Ready for Pickup', 
          icon: deliveryRequired ? CheckCircle : Package 
        };
      case 'out_for_delivery':
        return { label: 'Out for Delivery', icon: Truck };
      case 'delivered':
        return { label: 'Delivered', icon: CheckCircle };
      default:
        return { label: status, icon: Clock };
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {statuses.map((status, index) => {
        const config = getStatusConfig(status);
        const IconComponent = config.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={status} className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors',
                isCompleted 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted-foreground/30 text-muted-foreground'
              )}>
                <IconComponent className="w-4 h-4" />
              </div>
              {index < statuses.length - 1 && (
                <div className={cn(
                  'w-px h-8 mt-2 transition-colors',
                  isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                )} />
              )}
            </div>
            
            <div className="flex-1">
              <p className={cn(
                'font-medium transition-colors',
                isCompleted ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {config.label}
              </p>
              {isCurrent && (
                <p className="text-xs text-primary">Current status</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};