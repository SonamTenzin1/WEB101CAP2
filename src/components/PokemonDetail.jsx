/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Image, Text, Spinner, Flex, Heading, Divider, Button, Progress } from '@chakra-ui/react';
import useFavoriteStore from '../useFavoriteStore';

const PokemonDetails = () => {
  const { id } = useParams();
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllMoves, setShowAllMoves] = useState(false);
  const navigate = useNavigate();
  const { favoritePokemonList } = useFavoriteStore();

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemonDetails(response.data);
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  const handleAddToFavorites = () => {
    const favoritesFromStorage = localStorage.getItem('favoritePokemon');
    let favoriteList = [];
    if (favoritesFromStorage) {
      favoriteList = JSON.parse(favoritesFromStorage);
    }
    const isAlreadyFavorite = favoriteList.some((pokemon) => pokemon.id === pokemonDetails.id);

    if (!isAlreadyFavorite) {
      favoriteList.push({
        id: pokemonDetails.id,
        name: pokemonDetails.name,
        image: pokemonDetails.sprites.front_default,
      });
      localStorage.setItem('favoritePokemon', JSON.stringify(favoriteList));
      navigate('/favorites');
    } else {
      alert('This Pokémon is already in your favorites.');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!pokemonDetails) {
    return <Text>Error loading Pokémon details.</Text>;
  }

  const movesToShow = showAllMoves ? pokemonDetails.moves : pokemonDetails.moves.slice(0, 10);

  return (
    <Flex direction="column" alignItems="center">
      <Flex width="100%" justifyContent="center" mb={4}>
        <Button as={Link} to="/" variant="outline" mr={2} bg="red.500" color="white" _hover={{ bg: "red.600" }}>
          Back to Home
        </Button>
        <Button variant="outline" onClick={handleAddToFavorites} bg="red.500" color="white" _hover={{ bg: "red.600" }}>
          Add to Favorites
        </Button>
      </Flex>
      <Image src={pokemonDetails.sprites.front_default} alt={pokemonDetails.name} boxSize="200px" />
      <Flex width="100%" justifyContent="space-between" mt={4}>
        <Box flex="1" textAlign="center" mr={4}>
          <Heading as="h2" size="lg">About</Heading>
          <Text>Name: {pokemonDetails.name}</Text>
          <Text>Weight: {pokemonDetails.weight / 10} kg</Text>
          <Text>Height: {pokemonDetails.height / 10} m</Text>
          <Divider my={4} />
          <Heading as="h2" size="lg">Basic Stats</Heading>
          {pokemonDetails.stats.map((stat) => (
            <Box key={stat.stat.name} mb={4}>
              <Text>{stat.stat.name}: {stat.base_stat}</Text>
              <Box display="flex" justifyContent="center">
                <Progress value={stat.base_stat} max={100} colorScheme="red" size="sm" width="60%" />
              </Box>
            </Box>
          ))}
        </Box>
        <Box flex="1" textAlign="center">
          <Heading as="h2" size="lg">Moves</Heading>
          {movesToShow.map((move) => (
            <Box key={move.move.name} textAlign="left">
              <Text fontWeight="bold">{move.move.name}</Text>
              <Divider my={2} />
            </Box>
          ))}
          {!showAllMoves && pokemonDetails.moves.length > 10 && (
            <Button onClick={() => setShowAllMoves(true)} mt={4} size="sm">
              Show More Moves
            </Button>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default PokemonDetails;
