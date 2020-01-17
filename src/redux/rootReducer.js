import { combineReducers } from "redux";
import filterReducer from "./modules/filterReducer";
import pokemonListReducer from "./modules/pokemonList";

const rootReducer = combineReducers({
  filterReducer,
  pokemonListReducer,
});

export default rootReducer;
