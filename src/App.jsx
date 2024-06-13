import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PokemonDetails from './components/PokemonDetail';// Import the new component
import { ChakraProvider } from '@chakra-ui/react';
import Favorites from './components/Favourites';


function App() {
  return (
    <ChakraProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonDetails />} /> {/* New route */}
          <Route path="/favorites" element={<Favorites />} /> 

        </Routes>
    </ChakraProvider>
  );
}

export default App;
