import { Box, Image, Text, VStack, Heading, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

const Pokedex = () => {
  const [pokemonData, setPokemonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon/ditto");
        setPokemonData(data);
      } catch (error) {
        setErrorMessage("Error fetching Pokémon data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPokemonData();
  }, []);

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (errorMessage) {
    return <Text>{errorMessage}</Text>;
  }

  return (
    <VStack spacing={4}>
      {/* Display the name of the Pokémon */}
      <Heading>{pokemonData.name.toUpperCase()}</Heading>
      {/* Display the image of the Pokémon */}
      <Image src={pokemonData.sprites.front_default} alt={pokemonData.name} />
      <Box textAlign="center">
        {/* Display the height of the Pokémon */}
        <Text><strong>Height:</strong> {pokemonData.height}</Text>
        {/* Display the weight of the Pokémon */}
        <Text><strong>Weight:</strong> {pokemonData.weight}</Text>
        {/* Display the base experience of the Pokémon */}
        <Text><strong>Base Experience:</strong> {pokemonData.base_experience}</Text>
      </Box>
    </VStack>
  );
};

export default Pokedex;
