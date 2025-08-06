import { Notification } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Archive, Bell, Users, Heart } from 'lucide-react';

interface NotificationCardProps {
  notification: Notification;
  onAccept?: (notificationId: string) => void;
  onReject?: (notificationId: string) => void;
  onArchive?: (notificationId: string) => void;
}

export function NotificationCard({ notification, onAccept, onReject, onArchive }: NotificationCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'group_request':
        return <Users size={16} />;
      case 'favor_accepted':
      case 'favor_completed':
        return <Heart size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'group_request':
        return 'bg-purple-500';
      case 'favor_accepted':
        return 'bg-green-500';
      case 'favor_completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Meno di un\'ora fa';
    if (diffInHours < 24) return `${diffInHours} ore fa`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} giorni fa`;
  };

  const isUnread = notification.status === 'unread';
  const canRespond = notification.status === 'unread' && (notification.type === 'group_request');

  return (
    <Card className={`card-hover border ${isUnread ? 'border-blue-200 bg-blue-50' : 'border-gray-100'}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${getTypeColor(notification.type)} rounded-full flex items-center justify-center mr-3`}>
              <div className="text-white">
                {getTypeIcon(notification.type)}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <h3 className="font-semibold text-gray-900 mr-2">{notification.title}</h3>
                {isUnread && (
                  <Badge className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                    Nuovo
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">{formatDate(notification.createdAt!)}</p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 text-sm mb-4">{notification.message}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {canRespond && onAccept && onReject && (
              <>
                <Button
                  size="sm"
                  onClick={() => onAccept(notification.id)}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  <Check className="mr-1" size={14} />
                  Accetta
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(notification.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <X className="mr-1" size={14} />
                  Rifiuta
                </Button>
              </>
            )}
          </div>
          
          {onArchive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onArchive(notification.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Archive className="mr-1" size={14} />
              Archivia
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
