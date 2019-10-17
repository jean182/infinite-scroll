import { call, delay, put, takeEvery, takeLatest } from "redux-saga/effects";
import { getPokemonList, loadMorePokemonList } from "../../api/pokemonEndpoints";


// Actions types
const FETCH_POKEMON_LIST = "pokemon-frontend/pokemon/FETCH_POKEMON_LIST";
const FETCH_POKEMON_LIST_SUCCESS =
  "pokemon-frontend/pokemon/FETCH_POKEMON_LIST_SUCCESS";
const FETCH_POKEMON_LIST_FAILURE =
  "pokemon-frontend/pokemon/FETCH_POKEMON_LIST_FAILURE";
const LOAD_MORE_POKEMON = "pokemon-frontend/pokemon/LOAD_MORE_POKEMON";
const LOAD_MORE_POKEMON_SUCCEED =
  "pokemon-frontend/pokemon/LOAD_MORE_POKEMON_SUCCEED";
const LOAD_MORE_POKEMON_FAILED =
  "pokemon-frontend/pokemon/LOAD_MORE_POKEMON_FAILED";

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
      return {
        ...state,
        pokemonList: action.payload.data.results,
        isLoading: false,
      };
    case FETCH_POKEMON_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case LOAD_MORE_POKEMON:
      return {
        ...state,
        isLoading: true,
      };
    case LOAD_MORE_POKEMON_SUCCEED:
      const newPokemonList = action.payload.data.results;
      const { pokemonList } = state;
      return {
        ...state,
        pokemonList: [...pokemonList, ...newPokemonList],
        isLoading: false,
      };
    case LOAD_MORE_POKEMON_FAILED:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Action Creators
export function loadPokemonList() {
  return { type: FETCH_POKEMON_LIST };
}

export function loadPokemonListSucceed(payload) {
  return { type: FETCH_POKEMON_LIST_SUCCESS, payload };
}

export function loadPokemonListFailed(payload) {
  return { type: FETCH_POKEMON_LIST_FAILURE, payload };
}

export function loadMorePokemon(payload) {
  return { type: LOAD_MORE_POKEMON, payload };
}

export function loadMorePokemonSucceed(payload) {
  return { type: LOAD_MORE_POKEMON_SUCCEED, payload };
}

export function loadMorePokemonFailed(payload) {
  return { type: LOAD_MORE_POKEMON_FAILED, payload };
}

export function* fetchPokemonListSaga() {
  try {
    const response = yield call(getPokemonList, 0);
    yield put(loadPokemonListSucceed(response));
  } catch (error) {
    yield put(loadPokemonListFailed(error.message));
  }
}

export function* loadMorePokemonListSaga(action) {
  const { payload } = action;
  try {
    const response = yield call(loadMorePokemonList, payload);
    yield delay(1000);
    yield put(loadMorePokemonSucceed(response));
  } catch (error) {
    yield put(loadMorePokemonFailed(error.message));
  }
}

export function* pokemonListWatcherSaga() {
  yield takeLatest(FETCH_POKEMON_LIST, fetchPokemonListSaga);
  yield takeEvery(LOAD_MORE_POKEMON, loadMorePokemonListSaga);
}
