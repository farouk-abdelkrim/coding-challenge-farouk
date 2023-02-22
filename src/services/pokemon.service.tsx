import axios from "axios";

const endpoint = "https://pokeapi.co/api/v2/pokemon/";
export const fetchPokemons = async (url: string): Promise<any> => {
  const response = await axios.get(url);
  return response.data;
};

export const fetchPokemonDetails = async (name: string): Promise<any> => {
  const response = await axios.get(endpoint + name);
  return response.data;
};
