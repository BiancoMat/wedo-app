import { Group } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Lock, Globe } from 'lucide-react';

interface GroupCardProps {
  group: Group;
  memberCount?: number;
  isMember?: boolean;
  onJoin?: (groupId: string) => void;
  onView?: (groupId: string) => void;
}

export function GroupCard({ group, memberCount = 0, isMember = false, onJoin, onView }: GroupCardProps) {
  const getTypeIcon = (type: string) => {
    return type === 'private' ? <Lock size={14} /> : <Globe size={14} />;
  };

  const getTypeColor = (type: string) => {
    return type === 'private' ? 'bg-orange-500' : 'bg-green-500';
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('it-IT', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="card-hover border border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="font-semibold text-gray-900 mr-3">{group.name}</h3>
              <Badge className={`${getTypeColor(group.type)} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center`}>
                {getTypeIcon(group.type)}
                <span className="ml-1 capitalize">{group.type === 'private' ? 'Privato' : 'Pubblico'}</span>
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{group.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="mr-1" size={14} />
              {memberCount} membri
            </div>
            <span>Creato {formatDate(group.createdAt!)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {isMember ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView?.(group.id)}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Visualizza
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => onJoin?.(group.id)}
                className="wedo-blue text-white hover:wedo-blue-dark"
              >
                Unisciti
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
