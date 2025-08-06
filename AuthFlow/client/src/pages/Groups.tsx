import { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GroupCard } from '@/components/GroupCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Users, Globe, Lock } from 'lucide-react';
import { Group, InsertGroup } from '@shared/schema';
import { generateId } from '@/lib/utils';

export default function Groups() {
  const { currentUser, groups, addGroup, addNotification } = useAppContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [publicGroups, setPublicGroups] = useState<Group[]>([]);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'public' | 'private'>('public');
  const [managementType, setManagementType] = useState<'equal' | 'founder' | 'admin'>('equal');

  useEffect(() => {
    // Filter groups by type
    const publicGroupsList = groups.filter(group => group.type === 'public');
    const userGroupsList = groups.filter(group => group.founderId === currentUser?.id);
    
    setPublicGroups(publicGroupsList);
    setUserGroups(userGroupsList);
  }, [groups, currentUser]);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !name || !description) return;

    const newGroup: Group = {
      id: generateId(),
      name,
      description,
      type,
      managementType,
      founderId: currentUser.id,
      createdAt: new Date(),
    };

    addGroup(newGroup);

    // Reset form
    setName('');
    setDescription('');
    setType('public');
    setManagementType('equal');
    setIsCreateModalOpen(false);

    addNotification({
      type: 'group_request',
      title: 'Gruppo Creato',
      message: `Il gruppo "${name}" è stato creato con successo! Ora puoi invitare membri.`,
      relatedId: newGroup.id,
    });
  };

  const handleJoinGroup = (groupId: string) => {
    if (!currentUser) return;
    
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    addNotification({
      type: 'group_request',
      title: 'Richiesta di Ingresso Inviata',
      message: `Hai inviato una richiesta per unirti al gruppo "${group.name}". Attendi l'approvazione.`,
      relatedId: groupId,
    });
  };

  const handleViewGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    addNotification({
      type: 'group_request',
      title: 'Gruppo Visualizzato',
      message: `Stai visualizzando il gruppo "${group.name}". Qui potrai vedere i membri e partecipare alla bacheca.`,
      relatedId: groupId,
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
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Gruppi</h1>
            <p className="text-gray-600">Crea o unisciti a gruppi per collaborare sui favori</p>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Plus className="mr-2" size={16} />
                Nuovo Gruppo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-600">Nuovo Gruppo</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleCreateGroup} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nome del Gruppo</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Es. Sviluppatori Milano"
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
                    placeholder="Descrivi lo scopo e le attività del gruppo..."
                    required
                    className="rounded-xl"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Tipo di Gruppo</Label>
                    <Select value={type} onValueChange={(value: 'public' | 'private') => setType(value)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center">
                            <Globe className="mr-2" size={16} />
                            Pubblico
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center">
                            <Lock className="mr-2" size={16} />
                            Privato
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Modalità di Gestione</Label>
                    <Select value={managementType} onValueChange={(value: 'equal' | 'founder' | 'admin') => setManagementType(value)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equal">Membri Uguali</SelectItem>
                        <SelectItem value="founder">Solo Fondatore</SelectItem>
                        <SelectItem value="admin">Più Amministratori</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                  >
                    Crea Gruppo
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Groups content */}
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="discover">Scopri Gruppi ({publicGroups.length})</TabsTrigger>
            <TabsTrigger value="my-groups">I Miei Gruppi ({userGroups.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="mt-6">
            <Card className="border border-gray-100">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center">
                  <Search className="mr-2" size={20} />
                  Gruppi Pubblici
                </CardTitle>
              </CardHeader>
              <CardContent>
                {publicGroups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {publicGroups.map((group) => (
                      <GroupCard
                        key={group.id}
                        group={group}
                        memberCount={Math.floor(Math.random() * 50) + 5} // Mock member count
                        isMember={false}
                        onJoin={handleJoinGroup}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun gruppo pubblico</h3>
                    <p className="text-gray-600 mb-4">Non ci sono ancora gruppi pubblici disponibili.</p>
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                      Crea il Primo Gruppo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="my-groups" className="mt-6">
            <Card className="border border-gray-100">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center">
                  <Users className="mr-2" size={20} />
                  Gruppi che Gestisci
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userGroups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userGroups.map((group) => (
                      <GroupCard
                        key={group.id}
                        group={group}
                        memberCount={Math.floor(Math.random() * 50) + 5} // Mock member count
                        isMember={true}
                        onView={handleViewGroup}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun gruppo creato</h3>
                    <p className="text-gray-600 mb-4">Non hai ancora creato alcun gruppo.</p>
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                      Crea il Tuo Primo Gruppo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button for mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
}
