import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Flex,
  Image,
  Text,
  Input,
  Button,
  Spinner,
  Heading,
  Grid,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import useFavoriteStore from "../useFavoriteStore";

const Favorites = () => {
  // State variables
  const {
    favoritePokemonList,
    setFavoritePokemonList,
    removeFavoritePokemon,
  } = useFavoriteStore();
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  // Fetch favorite Pokemon from local storage on component mount
  useEffect(() => {
    const fetchFavoritePokemon = async () => {
      try {
        const favoritesFromStorage = localStorage.getItem("favoritePokemon");
        if (favoritesFromStorage) {
          const favoriteList = JSON.parse(favoritesFromStorage);
          setFavoritePokemonList(favoriteList);
        }
      } catch (error) {
        setErrorMessage("Error fetching favorites. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavoritePokemon();
  }, [setFavoritePokemonList]);

  // Fetch Pokemon details for each favorite Pokemon
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const promises = favoritePokemonList.map((pokemon) =>
          axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`).then((res) => ({
            name: pokemon.name,
            weight: res.data.weight / 10,
            height: res.data.height / 10,
            id: res.data.id,
          }))
        );
        const details = await Promise.all(promises);
        const detailsMap = details.reduce((acc, detail) => {
          acc[detail.name] = detail;
          return acc;
        }, {});
        setPokemonDetails(detailsMap);
      } catch (error) {
        setErrorMessage("Error fetching Pokémon details. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (favoritePokemonList.length) {
      fetchPokemonDetails();
    }
  }, [favoritePokemonList]);

  // Event handler for search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  // Event handler for removing a favorite Pokemon
  const handleRemoveFavorite = (id) => {
    removeFavoritePokemon(id);
    const updatedFavorites = favoritePokemonList.filter(
      (pokemon) => pokemon.id !== id
    );
    localStorage.setItem("favoritePokemon", JSON.stringify(updatedFavorites));
  };

  // Filter favorite Pokemon based on search query
  const filteredFavoritePokemonList = favoritePokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render favorite Pokemon cards
  const renderFavoritePokemons = () => {
    const pokemonsPerPage = 100;
    const startIndex = (currentPage - 1) * pokemonsPerPage;
    const endIndex = startIndex + pokemonsPerPage;
    return filteredFavoritePokemonList.slice(startIndex, endIndex).map((pokemon) => {
      const detail = pokemonDetails[pokemon.name];
      return (
        <Box
          key={pokemon.name}
          boxShadow="md"
          p={4}
          borderRadius="md"
          textAlign="center"
          cursor="pointer"
          onClick={() => navigate(`/pokemon/${detail.id}`)}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {detail ? (
            <>
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detail.id}.png`}
                alt={pokemon.name}
                boxSize="100px"
              />
              <Text fontWeight="bold" fontSize="sm">{pokemon.name.toUpperCase()}</Text>
              <Text fontSize="xs">Weight: {detail.weight.toFixed(1)} kg</Text>
              <Text fontSize="xs">Height: {detail.height.toFixed(1)} m</Text>
              <Button
                mt={2}
                size="sm"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavorite(pokemon.id);
                }}
              >
                Remove from Favorites
              </Button>
            </>
          ) : (
            <Spinner size="sm" />
          )}
        </Box>
      );
    });
  };

  return (
    <Flex direction="column" align="center" minHeight="100vh" p={8}>
      <Box textAlign="center" mb={6}>
        <Heading as="h1" size="lg" mt={2}>Favorites</Heading>
        <Box bg="red" p={2} borderRadius="md" mb={2}>
          <Button as={Link} to="/" variant="link">Back to Home</Button>
        </Box>
      </Box>
      <Input
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for Pokémon Here"
        mb={4}
      />
      {errorMessage ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {errorMessage}
        </Alert>
      ) : isLoading ? (
        <Flex justify="center" align="center" height="50vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <Grid templateColumns="repeat(4, 1fr)" gap={4} width="100%">
            {renderFavoritePokemons()}
          </Grid>
          <Flex mt={4}>
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Text mx={4}>{currentPage}</Text>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * 100 >= filteredFavoritePokemonList.length}
            >
              Next
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default Favorites;
