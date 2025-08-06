import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { User, Favor, Group, Notification, InsertNotification } from '@shared/schema';
import { generateId } from '@/lib/utils';

interface AppContextType {
  currentUser: User | null;
  credits: number;
  favors: Favor[];
  groups: Group[];
  notifications: Notification[];
  completedFavors: number;
  updateUserCredits: (credits: number) => void;
  addFavor: (favor: Favor) => void;
  addGroup: (group: Group) => void;
  addNotification: (notification: InsertNotification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  incrementCompletedFavors: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('wedo_user', null);
  const [favors, setFavors] = useLocalStorage<Favor[]>('wedo_favors', []);
  const [groups, setGroups] = useLocalStorage<Group[]>('wedo_groups', []);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('wedo_notifications', []);
  const [completedFavors, setCompletedFavors] = useLocalStorage<number>('wedo_completed_favors', 12);

  // Initialize user data when Firebase user changes
  useEffect(() => {
    if (user && (!currentUser || currentUser.email !== user.email)) {
      const userData: User = {
        id: user.uid,
        email: user.email!,
        credits: currentUser?.credits || 5, // Default credits
        createdAt: new Date(),
      };
      setCurrentUser(userData);
    } else if (!user) {
      setCurrentUser(null);
    }
  }, [user, currentUser, setCurrentUser]);

  const updateUserCredits = (credits: number) => {
    if (currentUser) {
      const oldCredits = currentUser.credits || 0;
      setCurrentUser({ ...currentUser, credits });
      
      // If user gained credits and had 0 before, reactivate suspended requests
      if (oldCredits === 0 && credits > 0) {
        // In a real app, this would update suspended favors to active status
        addNotification({
          type: 'favor_completed',
          title: 'Richieste Riattivate',
          message: 'Le tue richieste sospese sono state riattivate ora che hai guadagnato nuovi crediti!',
          relatedId: null,
        });
      }
    }
  };

  const addFavor = (favor: Favor) => {
    setFavors(prev => [favor, ...prev]);
  };

  const addGroup = (group: Group) => {
    setGroups(prev => [group, ...prev]);
  };

  const addNotification = (notificationData: InsertNotification) => {
    const notification: Notification = {
      id: generateId(),
      userId: currentUser?.id || '',
      status: 'unread',
      createdAt: new Date(),
      ...notificationData,
      relatedId: notificationData.relatedId || null,
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, status: 'read' }
          : notif
      )
    );
  };

  const incrementCompletedFavors = () => {
    setCompletedFavors(prev => prev + 1);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      credits: currentUser?.credits || 0,
      favors,
      groups,
      notifications,
      completedFavors,
      updateUserCredits,
      addFavor,
      addGroup,
      addNotification,
      markNotificationAsRead,
      incrementCompletedFavors,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
