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
      <Heading>{pokemonData.name.toUpperCase()}</Heading>
      <Image src={pokemonData.sprites.front_default} alt={pokemonData.name} />
      <Box textAlign="center">
        <Text><strong>Height:</strong> {pokemonData.height}</Text>
        <Text><strong>Weight:</strong> {pokemonData.weight}</Text>
        <Text><strong>Base Experience:</strong> {pokemonData.base_experience}</Text>
      </Box>
    </VStack>
  );
};

export default Pokedex;
