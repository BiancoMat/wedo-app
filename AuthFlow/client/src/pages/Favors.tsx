import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FavorCard } from '@/components/FavorCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Heart, Gift } from 'lucide-react';
import { Favor, InsertFavor } from '@shared/schema';
import { generateId } from '@/lib/utils';

export default function Favors() {
  const { currentUser, favors, addFavor, updateUserCredits, addNotification } = useAppContext();
  const [location, navigate] = useLocation();
  const [searchParams] = useState(new URLSearchParams(location.split('?')[1] || ''));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [publicFavors, setPublicFavors] = useState<Favor[]>([]);
  
  // Form state
  const [favorType, setFavorType] = useState<'request' | 'offer'>('request');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationValue, setLocationValue] = useState<'remote' | 'presential'>('remote');


  useEffect(() => {
    // Set initial form type based on URL parameter
    const action = searchParams.get('action');
    if (action === 'offer') {
      setFavorType('offer');
    } else {
      setFavorType('request');
    }
  }, [searchParams]);

  useEffect(() => {
    // Get public favors (excluding user's own)
    const publicFavorsList = favors
      .filter(favor => favor.userId !== currentUser?.id)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    setPublicFavors(publicFavorsList);
  }, [favors, currentUser]);

  const handleCreateFavor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !title || !description) return;

    // Check if user has enough credits to publish any favor
    if ((currentUser.credits || 0) < 1) {
      addNotification({
        type: 'favor_completed',
        title: 'Crediti Insufficienti',
        message: 'Non hai crediti disponibili per pubblicare favori. Completa alcuni favori per guadagnarne di nuovi!',
        relatedId: null,
      });
      return;
    }

    const newFavor: Favor = {
      id: generateId(),
      userId: currentUser.id,
      title,
      description,
      type: favorType,
      location: locationValue,
      credits: 1,
      status: 'active',
      acceptedBy: null,
      createdAt: new Date(),
    };

    addFavor(newFavor);

    // Deduct 1 credit for publishing any favor
    const newCredits = (currentUser.credits || 0) - 1;
    updateUserCredits(newCredits);

    // If user now has 0 credits, suspend all other active requests
    if (newCredits === 0) {
      suspendUserRequests();
    }

    // Reset form
    setTitle('');
    setDescription('');
    setIsCreateModalOpen(false);

    addNotification({
      type: 'favor_completed',
      title: 'Favore Pubblicato',
      message: `Il tuo ${favorType === 'request' ? 'richiesta' : 'offerta'} "${title}" è stato pubblicato con successo!`,
      relatedId: newFavor.id,
    });
  };

  const suspendUserRequests = () => {
    // This would update user's active requests to suspended status
    // In a real app, this would be a server call
    addNotification({
      type: 'favor_completed',
      title: 'Richieste Sospese',
      message: 'Le tue richieste attive sono state sospese per mancanza di crediti. Si riattiveranno quando guadagnerai nuovi crediti.',
      relatedId: null,
    });
  };

  const handleAcceptFavor = (favorId: string) => {
    if (!currentUser) return;
    
    addNotification({
      type: 'favor_accepted',
      title: 'Favore Accettato',
      message: 'Hai accettato un favore! Il richiedente è stato notificato.',
      relatedId: favorId,
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Favori</h1>
            <p className="text-gray-600">Cerca, richiedi o proponi favori alla community</p>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                disabled={currentUser.credits === 0}
              >
                <Plus className="mr-2" size={16} />
                Nuovo Favore {currentUser.credits === 0 && '(Crediti Esauriti)'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-600">Nuovo Favore</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleCreateFavor} className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Tipo di Favore</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={favorType === 'request' ? 'default' : 'outline'}
                      onClick={() => setFavorType('request')}
                      className={`p-4 h-auto ${
                        favorType === 'request'
                          ? 'bg-purple-500 hover:bg-purple-600'
                          : 'border-gray-200 hover:border-purple-500'
                      }`}
                    >
                      <div className="text-center">
                        <Heart className="mx-auto mb-2" size={20} />
                        <p className="font-medium">Richiesta</p>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant={favorType === 'offer' ? 'default' : 'outline'}
                      onClick={() => setFavorType('offer')}
                      className={`p-4 h-auto ${
                        favorType === 'offer'
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'border-gray-200 hover:border-green-500'
                      }`}
                    >
                      <div className="text-center">
                        <Gift className="mx-auto mb-2" size={20} />
                        <p className="font-medium">Offerta</p>
                      </div>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="title">Titolo</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Es. Aiuto per trasloco"
                    required
                    className="rounded-xl"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Descrivi in dettaglio il favore..."
                    required
                    className="rounded-xl"
                  />
                </div>
                
                <div>
                  <Label>Modalità</Label>
                  <Select value={locationValue} onValueChange={(value: 'remote' | 'presential') => setLocationValue(value)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remoto</SelectItem>
                      <SelectItem value="presential">Presenziale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-blue-800 mb-1">Costo Pubblicazione</p>
                  <p className="text-sm text-blue-700">
                    Ogni favore costa <span className="font-bold">1 credito</span> per essere pubblicato. 
                    Guadagni crediti completando favori per altri utenti.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Annulla
                  </Button>
                  <Button
                    type="submit"
                    className="wedo-blue text-white hover:wedo-blue-dark"
                  >
                    Pubblica Favore
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Credits warning */}
        {currentUser.credits === 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <Heart className="text-red-500" size={16} />
                </div>
                <div>
                  <p className="font-medium text-red-800">Crediti Esauriti</p>
                  <p className="text-sm text-red-700">
                    Non puoi pubblicare favori senza crediti. Ogni favore costa 1 credito. 
                    Completa alcuni favori per guadagnarne di nuovi!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Low credits warning */}
        {currentUser.credits === 1 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <Heart className="text-orange-500" size={16} />
                </div>
                <div>
                  <p className="font-medium text-orange-800">Ultimo Credito Disponibile</p>
                  <p className="text-sm text-orange-700">
                    Hai solo 1 credito rimasto. Pubblicando questo favore, le tue altre richieste 
                    attive verranno sospese fino a quando non guadagnerai nuovi crediti.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Favors list */}
        <Card className="border border-gray-100">
          <CardHeader>
            <CardTitle className="text-blue-600 flex items-center">
              <Search className="mr-2" size={20} />
              Cerca Favori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Tutti ({publicFavors.length})</TabsTrigger>
                <TabsTrigger value="requests">
                  Richieste ({publicFavors.filter(f => f.type === 'request').length})
                </TabsTrigger>
                <TabsTrigger value="offers">
                  Offerte ({publicFavors.filter(f => f.type === 'offer').length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {publicFavors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {publicFavors.map((favor) => (
                      <FavorCard
                        key={favor.id}
                        favor={favor}
                        onAccept={handleAcceptFavor}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun favore disponibile</h3>
                    <p className="text-gray-600">Sii il primo a pubblicare un favore!</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="requests" className="mt-6">
                {publicFavors.filter(f => f.type === 'request').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {publicFavors
                      .filter(favor => favor.type === 'request')
                      .map((favor) => (
                        <FavorCard
                          key={favor.id}
                          favor={favor}
                          onAccept={handleAcceptFavor}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessuna richiesta disponibile</h3>
                    <p className="text-gray-600">Non ci sono richieste di favori al momento.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="offers" className="mt-6">
                {publicFavors.filter(f => f.type === 'offer').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {publicFavors
                      .filter(favor => favor.type === 'offer')
                      .map((favor) => (
                        <FavorCard
                          key={favor.id}
                          favor={favor}
                          onAccept={handleAcceptFavor}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gift size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessuna offerta disponibile</h3>
                    <p className="text-gray-600">Non ci sono offerte di favori al momento.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Button for mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={currentUser.credits === 0}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50"
        >
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
}
