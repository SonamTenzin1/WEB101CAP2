import {create} from 'zustand';

const useFavoriteStore = create((set) => ({
  favorites: [], 
  setFavorites: (favorites) => set({ favorites }),
  removeFavorite: (id) => set((state) => ({
    favorites: state.favorites.filter(pokemon => pokemon.id !== id), 
  })),
}));

export default useFavoriteStore;
