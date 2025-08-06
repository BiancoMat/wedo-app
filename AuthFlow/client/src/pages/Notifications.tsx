import { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationCard } from '@/components/NotificationCard';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, Archive, Trash2 } from 'lucide-react';
import { Notification } from '@shared/schema';

export default function Notifications() {
  const { currentUser, notifications, markNotificationAsRead, addNotification } = useAppContext();
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const unread = notifications.filter(notif => notif.status === 'unread');
    const read = notifications.filter(notif => notif.status === 'read');
    
    setUnreadNotifications(unread);
    setReadNotifications(read);
  }, [notifications, currentUser]);

  const handleAcceptNotification = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    
    addNotification({
      type: 'group_request',
      title: 'Richiesta Accettata',
      message: 'Hai accettato la richiesta con successo!',
      relatedId: null,
    });
  };

  const handleRejectNotification = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    
    addNotification({
      type: 'group_request',
      title: 'Richiesta Rifiutata',
      message: 'Hai rifiutato la richiesta.',
      relatedId: null,
    });
  };

  const handleArchiveNotification = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const markAllAsRead = () => {
    unreadNotifications.forEach(notif => {
      markNotificationAsRead(notif.id);
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2 flex items-center">
              <Bell className="mr-3" size={32} />
              Centro Notifiche
            </h1>
            <p className="text-gray-600">Gestisci le tue notifiche e richieste</p>
          </div>
          
          {unreadNotifications.length > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <CheckCircle className="mr-2" size={16} />
              Segna Tutto come Letto
            </Button>
          )}
        </div>

        {/* Notification stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Bell className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{unreadNotifications.length}</p>
                  <p className="text-sm text-gray-600">Non Lette</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{readNotifications.length}</p>
                  <p className="text-sm text-gray-600">Lette</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <Archive className="text-orange-500" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                  <p className="text-sm text-gray-600">Totali</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications content */}
        <Card className="border border-gray-100">
          <CardContent className="p-6">
            <Tabs defaultValue="unread" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="unread" className="relative">
                  Non Lette 
                  {unreadNotifications.length > 0 && (
                    <Badge className="ml-2 bg-blue-500 text-white px-2 py-1 text-xs">
                      {unreadNotifications.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="read">Lette ({readNotifications.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="unread" className="mt-6">
                {unreadNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {unreadNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onAccept={handleAcceptNotification}
                        onReject={handleRejectNotification}
                        onArchive={handleArchiveNotification}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessuna notifica non letta</h3>
                    <p className="text-gray-600">Ottimo! Sei aggiornato su tutte le notifiche.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="read" className="mt-6">
                {readNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {readNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onArchive={handleArchiveNotification}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Archive size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessuna notifica letta</h3>
                    <p className="text-gray-600">Le notifiche che leggi appariranno qui.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
