import { all } from "redux-saga/effects";
import { pokemonListWatcherSaga } from "./modules/pokemonList";

export default function* rootSaga() {
  yield all([
    pokemonListWatcherSaga(),
  ]);
}
