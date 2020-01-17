import { call, delay, put, takeEvery, takeLatest } from "redux-saga/effects";
import { createSelector } from "reselect";
import { getPokemonList } from "../../api/pokemonEndpoints";
import { increment } from "./filterReducer";
import { getId } from "../../helpers/pokemonUtils";


// Actions types
const FETCH_POKEMON_LIST = "pokemon-frontend/pokemon/FETCH_POKEMON_LIST";
const FETCH_POKEMON_LIST_SUCCESS =
  "pokemon-frontend/pokemon/FETCH_POKEMON_LIST_SUCCESS";
const FETCH_POKEMON_LIST_FAILURE =
  "pokemon-frontend/pokemon/FETCH_POKEMON_LIST_FAILURE";
const DISPLAY_MORE_BEGIN = "pokemon-frontend/pokemon/DISPLAY_MORE_BEGIN";
const DISPLAY_MORE_END = "pokemon-frontend/pokemon/DISPLAY_MORE_END";

const initialState = { pokemonList: [], isLoading: false, error: "" };

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_POKEMON_LIST:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_POKEMON_LIST_SUCCESS:
      const { results } = action.payload.data;
      const pokemonResultsList = results.map(pokemon => {
        const id = parseInt(getId(pokemon.url), 10);
        return { id, ...pokemon };
      });
      return {
        ...state,
        pokemonList: pokemonResultsList,
        isLoading: false,
      };
    case FETCH_POKEMON_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case DISPLAY_MORE_BEGIN:
      return {
        ...state,
        isLoading: true,
      };
    case DISPLAY_MORE_END:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Action Creators
export function loadPokemonList(payload) {
  return { type: FETCH_POKEMON_LIST, payload };
}

export function loadPokemonListSucceed(payload) {
  return { type: FETCH_POKEMON_LIST_SUCCESS, payload };
}

export function loadPokemonListFailed(payload) {
  return { type: FETCH_POKEMON_LIST_FAILURE, payload };
}

export function displayMorePokemon() {
  return { type: DISPLAY_MORE_BEGIN };
}

export function displayMorePokemonEnd() {
  return { type: DISPLAY_MORE_END };
}

export function* fetchPokemonListSaga() {
  try {
    const response = yield call(getPokemonList, 0);
    yield put(loadPokemonListSucceed(response));
  } catch (error) {
    yield put(loadPokemonListFailed(error.message));
  }
}

// Selectors
const pokemonListSelector = state =>
  state.pokemonListReducer.pokemonList;
const filterSelector = state => state.filterReducer;

export const pokemonListFilterSelector = createSelector(
  [pokemonListSelector, filterSelector],
  (pokemonList, { count }) => {
    return pokemonList.filter(pokemon => pokemon.id <= count)
  },
);

export const pokemonListCount = createSelector(
  [pokemonListSelector],
  (pokemonList) => pokemonList.length
);

function* displayMorePokemonSaga() {
  yield delay(400);
  yield put(displayMorePokemonEnd());
  yield put(increment());
}

export function* pokemonListWatcherSaga() {
  yield takeLatest(FETCH_POKEMON_LIST, fetchPokemonListSaga);
  yield takeEvery(DISPLAY_MORE_BEGIN, displayMorePokemonSaga);
}
