// Data storage abstraction layer
// Currently uses localStorage, can be easily extended to use Firestore

export interface CompletedFavor {
  id: string;
  userId: string;
  favorId: string;
  completedAt: Date;
  creditEarned: number;
}

class DataStorage {
  // For now, use localStorage with a fallback structure
  private isLocalStorage = true;

  async saveCompletedFavor(completedFavor: CompletedFavor): Promise<void> {
    if (this.isLocalStorage) {
      const existing = this.getCompletedFavors();
      existing.push(completedFavor);
      localStorage.setItem('wedo_completed_favors_detail', JSON.stringify(existing));
    }
    // TODO: Add Firestore implementation here
    // const docRef = await addDoc(collection(db, 'completedFavors'), completedFavor);
  }

  getCompletedFavors(): CompletedFavor[] {
    if (this.isLocalStorage) {
      const stored = localStorage.getItem('wedo_completed_favors_detail');
      return stored ? JSON.parse(stored) : [];
    }
    // TODO: Add Firestore implementation here
    // const querySnapshot = await getDocs(collection(db, 'completedFavors'));
    return [];
  }

  async getCompletedFavorsCount(userId: string): Promise<number> {
    const completedFavors = this.getCompletedFavors();
    return completedFavors.filter(favor => favor.userId === userId).length;
  }

  // Future Firestore migration helper
  async migrateToFirestore(): Promise<void> {
    // This function will help migrate localStorage data to Firestore
    console.log('Ready for Firestore migration');
  }
}

export const dataStorage = new DataStorage();