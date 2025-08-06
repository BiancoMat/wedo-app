import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FavorCard } from '@/components/FavorCard';
import { Plus, Gift, HandHeart, Handshake, Star, Users } from 'lucide-react';
import { Favor } from '@shared/schema';

export default function Home() {
  const { currentUser, favors, addNotification, updateUserCredits, incrementCompletedFavors, completedFavors } = useAppContext();
  const [recentFavors, setRecentFavors] = useState<Favor[]>([]);

  useEffect(() => {
    // Get recent public favors (excluding user's own)
    const publicFavors = favors
      .filter(favor => favor.userId !== currentUser?.id && favor.status === 'active')
      .slice(0, 6);
    setRecentFavors(publicFavors);
  }, [favors, currentUser]);

  const handleAcceptFavor = (favorId: string) => {
    if (!currentUser) return;
    
    // Simulate accepting favor and add notification
    addNotification({
      type: 'favor_accepted',
      title: 'Favore Accettato',
      message: 'Hai accettato un favore! Il richiedente è stato notificato.',
      relatedId: favorId,
    });
  };

  const handleCompleteFavor = () => {
    if (!currentUser) return;
    
    // Simulate completing a favor and earning 1 credit
    const newCredits = (currentUser.credits || 0) + 1;
    updateUserCredits(newCredits);
    incrementCompletedFavors();
    
    addNotification({
      type: 'favor_completed',
      title: 'Favore Completato!',
      message: 'Hai completato un favore e guadagnato 1 credito. Continua così!',
      relatedId: null,
    });
  };

  const stats = {
    completedFavors: completedFavors,
    groups: 3,
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Ciao <span className="text-purple-600">{currentUser.email}</span>!
          </h1>
          <p className="text-gray-600">
            Hai <span className="font-bold text-orange-500">{currentUser.credits} crediti</span> disponibili per richiedere favori.
          </p>
        </div>
        
        {/* Quick actions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/favors?action=request">
              <a>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 card-hover h-auto">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                      <HandHeart size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">Richiedi un Favore</h3>
                      <p className="text-sm opacity-90">Chiedi aiuto alla community</p>
                    </div>
                  </div>
                </Button>
              </a>
            </Link>
            
            <Link href="/favors?action=offer">
              <a>
                <Button className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 card-hover h-auto">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                      <Gift size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">Proponi un Favore</h3>
                      <p className="text-sm opacity-90">Offri il tuo aiuto</p>
                    </div>
                  </div>
                </Button>
              </a>
            </Link>
            
            <Button 
              onClick={handleCompleteFavor}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 card-hover h-auto"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                  <Star size={24} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Completa Favore (Test)</h3>
                  <p className="text-sm opacity-90">+1 Credito</p>
                </div>
              </div>
            </Button>
          </div>
        </div>
        
        {/* Recent favors */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-600">Ultimi Favori Pubblicati</h2>
            <Link href="/favors">
              <a className="text-purple-600 hover:text-pink-500 font-medium transition-colors">
                Vedi tutti →
              </a>
            </Link>
          </div>
          
          {recentFavors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentFavors.map((favor) => (
                <FavorCard
                  key={favor.id}
                  favor={favor}
                  onAccept={handleAcceptFavor}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HandHeart size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun favore disponibile</h3>
                <p className="text-gray-600 mb-4">Sii il primo a pubblicare un favore nella community!</p>
                <Link href="/favors">
                  <Button className="wedo-blue text-white">
                    Pubblica Favore
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Handshake className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedFavors}</p>
                  <p className="text-sm text-gray-600">Favori Completati</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <Star className="text-orange-500" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
                  <p className="text-sm text-gray-600">Valutazione Media</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <Users className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.groups}</p>
                  <p className="text-sm text-gray-600">Gruppi Attivi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Action Button for mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <Link href="/favors">
          <Button className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
            <Plus size={24} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
