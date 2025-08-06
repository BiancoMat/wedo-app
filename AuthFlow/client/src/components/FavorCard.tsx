import { Favor } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface FavorCardProps {
  favor: Favor;
  showAcceptButton?: boolean;
  onAccept?: (favorId: string) => void;
}

export function FavorCard({ favor, showAcceptButton = true, onAccept }: FavorCardProps) {
  const { currentUser } = useAppContext();
  
  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getTypeColor = (type: string) => {
    return type === 'offer' ? 'bg-green-500' : 'bg-purple-500';
  };

  const getTypeLabel = (type: string) => {
    return type === 'offer' ? 'Offerta' : 'Richiesta';
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

  const isOwnFavor = currentUser && favor.userId === currentUser.id;
  const canAccept = showAcceptButton && !isOwnFavor && favor.status === 'active';

  return (
    <Card className="card-hover border border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">
                {getInitials(favor.userId)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{favor.userId}</p>
              <p className="text-xs text-gray-500">{formatDate(favor.createdAt!)}</p>
            </div>
          </div>
          <Badge className={`${getTypeColor(favor.type)} text-white px-3 py-1 rounded-full text-xs font-medium`}>
            {getTypeLabel(favor.type)}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2">{favor.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{favor.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="mr-1" size={14} />
            {favor.location === 'remote' ? 'Remoto' : 'Presenziale'}
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-orange-500 font-bold text-sm">
              {favor.credits} crediti
            </span>
            {favor.status !== 'active' && (
              <Badge variant="outline" className="text-xs">
                {favor.status === 'accepted' ? 'Accettato' : 
                 favor.status === 'completed' ? 'Completato' : 
                 favor.status === 'suspended' ? 'Sospeso' : favor.status}
              </Badge>
            )}
            {canAccept && onAccept && (
              <Button
                size="sm"
                onClick={() => onAccept(favor.id)}
                className="wedo-blue text-white hover:wedo-blue-dark"
              >
                Accetta
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
