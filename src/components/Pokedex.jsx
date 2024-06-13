import { Box, Image, Text, VStack, Heading, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

const Pokedex = () => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon/ditto");
        setPokemon(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchPokemon();
  }, []);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text>Error fetching data</Text>;
  }

  return (
    <VStack>
      <Heading>{pokemon.name.toUpperCase()}</Heading>
      <Image src={pokemon.sprites.front_default} alt={pokemon.name} />
      <Box>
        <Text><strong>Height:</strong> {pokemon.height}</Text>
        <Text><strong>Weight:</strong> {pokemon.weight}</Text>
        <Text><strong>Base Experience:</strong> {pokemon.base_experience}</Text>
      </Box>
    </VStack>
  );
};

export default Pokedex;
