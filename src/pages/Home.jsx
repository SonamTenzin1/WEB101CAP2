import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Box, Flex, Image, Text, Input, Button, Grid, Spinner, Heading } from "@chakra-ui/react";

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]); // State to store the list of Pokemon
  const [pokemonDetails, setPokemonDetails] = useState({}); // State to store the details of each Pokemon
  const [isLoading, setIsLoading] = useState(true); // State to track loading state
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const navigate = useNavigate(); // React Router's navigate function

  useEffect(() => {
    // Fetch the list of Pokemon from the API
    const fetchPokemonList = async () => {
      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
        setPokemonList(data.results);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchPokemonList();
  }, []);

  useEffect(() => {
    // Fetch the details of each Pokemon in the list
    const fetchPokemonDetails = async () => {
      const promises = pokemonList.map(pokemon =>
        axios.get(pokemon.url).then(({ data }) => ({
          name: pokemon.name,
          weight: data.weight / 10, // Convert hectograms to kilograms
          height: data.height / 10, // Convert decimeters to meters
          id: data.id,
        }))
      );
      const details = await Promise.all(promises);
      const detailsMap = details.reduce((acc, detail) => {
        acc[detail.name] = detail;
        return acc;
      }, {});
      setPokemonDetails(detailsMap);
    };

    if (pokemonList.length) {
      fetchPokemonDetails();
    }
  }, [pokemonList]);

  const handleSearchChange = (event) => {
    // Update the search query and reset the current page
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredPokemonList = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPokemons = () => {
    const pokemonsPerPage = 100;
    const startIndex = (currentPage - 1) * pokemonsPerPage;
    const endIndex = startIndex + pokemonsPerPage;
    return filteredPokemonList.slice(startIndex, endIndex).map(pokemon => {
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
          _hover={{ boxShadow: "lg", transform: "scale(1.05)", transition: "all 0.2s" }}
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
            </>
          ) : (
            <Spinner size="sm" />
          )}
        </Box>
      );
    });
  };

  return (
    <Flex direction="column" align="center" minHeight="100vh" p={12}>
      <Box textAlign="center" mb={15}>
        <Image src="asset\Pokédex_logo.png" alt="Pokeball" boxSize="9rem" mx="auto" />
        <Heading as="h1" size="lg" mt={2}></Heading>
        <Box bg="red.500" p={2} borderRadius="md" mb={2}>
          <Button as={Link} to="/favorites" variant="link" color="white">Favorites</Button>
        </Box>
      </Box>
      <Input
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for Pokémon Here"
        mb={4}
      />
      {isLoading ? (
        <Flex justify="center" align="center" height="50vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <Grid templateColumns="repeat(4, 1fr)" gap={4} width="100%">
            {renderPokemons()}
          </Grid>
          <Flex mt={4}>
            <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            <Text mx={4}>{currentPage}</Text>
            <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage * 100 >= filteredPokemonList.length}>
              Next
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default Home;
