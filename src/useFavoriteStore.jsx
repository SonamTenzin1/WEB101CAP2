import create from 'zustand';

const useFavoriteStore = create((set) => ({
  favoritePokemonList: [],
  setFavoritePokemonList: (favoritePokemonList) => set({ favoritePokemonList }),
  removeFavoritePokemon: (id) => set((state) => ({
    favoritePokemonList: state.favoritePokemonList.filter(pokemon => pokemon.id !== id),
  })),
}));

export default useFavoriteStore;
