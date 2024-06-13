import { useState, useEffect } from "react";
import axios from "axios";
import HomeForm from "./Home";

const HomePage = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon/ditto");
        setPokemonList([response.data]);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchPokemonList();
  }, []);

  return <HomeForm pokemonList={pokemonList} loading={loading} />;
};

export default HomePage;
