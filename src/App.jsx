import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PokemonDetails from './components/PokemonDetail'; // Import the component with correct case
import Favorites from './components/Favourites';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:id" element={<PokemonDetails />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
