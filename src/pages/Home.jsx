import  { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { Box, Flex, Image, Text, Input, Button, Grid, Spinner, Heading } from "@chakra-ui/react";

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
        setPokemonList(response.data.results);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };
    fetchPokemonList();
  }, []);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const promises = pokemonList.map((pokemon) =>
        axios.get(pokemon.url).then((res) => ({
          name: pokemon.name,
          weight: res.data.weight / 10, // Convert hectograms to kilograms
          height: res.data.height / 10, // Convert decimeters to meters
          id: res.data.id,
        }))
      );
      const details = await Promise.all(promises);
      const detailsMap = {};
      details.forEach((detail) => {
        detailsMap[detail.name] = detail;
      });
      setPokemonDetails(detailsMap);
    };

    if (pokemonList.length) {
      fetchPokemonDetails();
    }
  }, [pokemonList]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset current page when search query changes
  };

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPokemons = () => {
    const pokemonsPerPage = 100; // Set the number of Pokémon per page to 100
    const startIndex = (currentPage - 1) * pokemonsPerPage;
    const endIndex = startIndex + pokemonsPerPage;
    return filteredPokemonList.slice(startIndex, endIndex).map((pokemon) => {
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
          alignItems="center" // Align content vertically
          _hover={{ boxShadow: "lg", transform: "scale(1.05)", transition: "all 0.2s" }} // Add hover effect
        >
          {detail ? (
            <>
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detail.id}.png`}
                alt={pokemon.name}
                boxSize="100px" // Adjust the size of the image
              />
              <Text fontWeight="bold" fontSize="sm">{pokemon.name.toUpperCase()}</Text> {/* Decrease font size */}
              <Text fontSize="xs">Weight: {detail.weight.toFixed(1)} kg</Text> {/* Decrease font size */}
              <Text fontSize="xs">Height: {detail.height.toFixed(1)} m</Text> {/* Decrease font size */}
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
        <Image src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Pokeball" boxSize="50px" mx="auto" />
        <Heading as="h1" size="lg" mt={2}>Pokédex</Heading>
        <Box bg="red" p={2} borderRadius="md" mb={2}>
          <Button as={Link} to="/favorites" variant="link">Favorites</Button>
        </Box>
      </Box>
      <Input
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search Pokémon..."
        mb={4}
      />
      {loading ? (
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
