import { useState, useEffect } from "react";
import axios from "axios";
import HomeForm from "./Home";

const HomePage = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon/ditto");
        setPokemonData([data]);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonData();
  }, []);

  return <HomeForm pokemonList={pokemonData} loading={isLoading} />;
};

export default HomePage;
