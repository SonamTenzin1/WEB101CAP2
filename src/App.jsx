import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PokemonDetails from './components/PokemonDetail'; 
import Favorites from './components/Favourites';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/" element={<Home />} /> // Route for the home page
        <Route path="/pokemon/:id" element={<PokemonDetails />} /> // Route for the Pokemon details page
        <Route path="/favorites" element={<Favorites />} /> // Route for the favorites page
      </Routes>
    </ChakraProvider>
  );
}

export default App;
