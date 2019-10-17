import { combineReducers } from "redux";
import pokemonListReducer from "./modules/pokemonList";

const rootReducer = combineReducers({
  pokemonListReducer,
});

export default rootReducer;
