import { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FavorCard } from '@/components/FavorCard';
import { Coins, Clock, CheckCircle, Pause } from 'lucide-react';
import { Favor } from '@shared/schema';

export default function Profile() {
  const { currentUser, favors, completedFavors } = useAppContext();
  const [userFavors, setUserFavors] = useState<{
    sent: Favor[];
    received: Favor[];
    active: Favor[];
    suspended: Favor[];
  }>({
    sent: [],
    received: [],
    active: [],
    suspended: [],
  });

  useEffect(() => {
    if (!currentUser) return;

    const sent = favors.filter(favor => favor.userId === currentUser.id);
    const received = favors.filter(favor => favor.acceptedBy === currentUser.id);
    const active = sent.filter(favor => favor.status === 'active');
    const suspended = sent.filter(favor => favor.status === 'suspended');

    setUserFavors({ sent, received, active, suspended });
  }, [favors, currentUser]);

  if (!currentUser) {
    return null;
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Il tuo Profilo</h1>
          <p className="text-gray-600">Gestisci i tuoi crediti e visualizza la cronologia dei favori</p>
        </div>

        {/* Credits overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={`border ${currentUser.credits === 0 ? 'border-red-200 bg-red-50' : currentUser.credits === 1 ? 'border-orange-200 bg-orange-50' : 'border-gray-100'}`}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${currentUser.credits === 0 ? 'bg-red-100' : currentUser.credits === 1 ? 'bg-orange-100' : 'bg-green-100'}`}>
                  <Coins className={`${currentUser.credits === 0 ? 'text-red-500' : currentUser.credits === 1 ? 'text-orange-500' : 'text-green-500'}`} size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{currentUser.credits}</p>
                  <p className="text-sm text-gray-600">Crediti Disponibili</p>
                  {currentUser.credits === 0 && <p className="text-xs text-red-600 mt-1">Non puoi pubblicare</p>}
                  {currentUser.credits === 1 && <p className="text-xs text-orange-600 mt-1">Ultimo credito!</p>}
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
                  <p className="text-2xl font-bold text-gray-900">{completedFavors}</p>
                  <p className="text-sm text-gray-600">Favori Completati</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="text-blue-500" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{userFavors.active.length}</p>
                  <p className="text-sm text-gray-600">Richieste Attive</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                  <Pause className="text-yellow-500" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{userFavors.suspended.length}</p>
                  <p className="text-sm text-gray-600">Richieste Sospese</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credits explanation */}
        <Card className="mb-8 border border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-600">Come Funzionano i Crediti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Ogni favore costa 1 credito</p>
                  <p className="text-sm text-blue-700">Sia le richieste che le offerte richiedono 1 credito per essere pubblicate.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Con 0 crediti non puoi pubblicare</p>
                  <p className="text-sm text-blue-700">Devi avere almeno 1 credito disponibile per creare nuovi favori.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Con l'ultimo credito le altre richieste si sospendono</p>
                  <p className="text-sm text-blue-700">Se pubblichi con 1 credito, le tue altre richieste attive vengono sospese temporaneamente.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <p className="font-medium text-green-800">Guadagni crediti completando favori</p>
                  <p className="text-sm text-green-700">Ogni favore che completi per altri utenti ti fa guadagnare 1 credito.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User info card */}
        <Card className="mb-8 border border-gray-100">
          <CardHeader>
            <CardTitle className="text-blue-600">Informazioni Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
                <p className="text-gray-900">{currentUser.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Membro dal</p>
                <p className="text-gray-900">{formatDate(currentUser.createdAt!)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favor history */}
        <Card className="border border-gray-100">
          <CardHeader>
            <CardTitle className="text-blue-600">Cronologia Favori</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sent" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sent">Favori Inviati ({userFavors.sent.length})</TabsTrigger>
                <TabsTrigger value="received">Favori Ricevuti ({userFavors.received.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sent" className="mt-6">
                {userFavors.sent.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {userFavors.sent.map((favor) => (
                      <FavorCard
                        key={favor.id}
                        favor={favor}
                        showAcceptButton={false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun favore inviato</h3>
                    <p className="text-gray-600">Non hai ancora pubblicato alcun favore.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="received" className="mt-6">
                {userFavors.received.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {userFavors.received.map((favor) => (
                      <FavorCard
                        key={favor.id}
                        favor={favor}
                        showAcceptButton={false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun favore ricevuto</h3>
                    <p className="text-gray-600">Non hai ancora accettato alcun favore.</p>
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
