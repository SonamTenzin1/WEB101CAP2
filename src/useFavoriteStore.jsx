import { create } from 'zustand';

// Create a custom hook called useFavoriteStore
const useFavoriteStore = create((set) => ({
  favorites: [], // Array to store favorite items
  setFavorites: (favorites) => set({ favorites }), // Function to set the favorite items
  removeFavorite: (id) => set((state) => ({
    favorites: state.favorites.filter(pokemon => pokemon.id !== id), // Remove the favorite item with the given id
  })),
}));

export default useFavoriteStore;
