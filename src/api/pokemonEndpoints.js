import API from "./axiosInstance";

export const getPokemonList = () => {
  return API("get", `/pokemon/?offset=0&limit=20`);
};

export const loadMorePokemonList = limit => {
  return API("get", `/pokemon/?offset=${limit}&limit=20`);
};
