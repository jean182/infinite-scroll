import _ from "lodash";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadPokemonList, displayMorePokemon, pokemonListFilterSelector, pokemonListCount } from "../redux/modules/pokemonList";
import ListItemLoader from "./ListItemLoader";
import PokemonListItem from "./PokemonListItem";

const PokemonList = props => {
  const {
    fetchActionCreator,
    displayMore,
    isLoading,
    error,
    pokemonList,
    totalPokemonCount
  } = props;

  useEffect(() => {
    fetchActionCreator();
  }, [fetchActionCreator]);

  const handleScroll = event => {
    const element = event.target;
    if ((element.scrollHeight - element.scrollTop === element.clientHeight) && totalPokemonCount > pokemonList.length) {
      displayMore();
    }
  };

  if (_.isEmpty(pokemonList) && isLoading) return <ListItemLoader />;
  if (error) return <p>Error</p>;
  return (
      <div className="border m-5">
        <div
          className="row"
          onScroll={handleScroll}
          style={{ height: "500px", overflow: "auto" }}
        >
          {_.isEmpty(pokemonList) && <p>No results for this search</p>}
          {pokemonList.map(pokemon => {
            const { id, name } = pokemon;
            return (
              <div key={pokemon.url} className="col-sm-3">
                <PokemonListItem id={id} name={name} />
              </div>
            );
          })}
        </div>
        {isLoading && (
          <div className="text-center">
            <div
              className="spinner-border"
              style={{ width: "4rem", height: "4rem" }}
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        <p className="text-muted ml-3">Displaying {pokemonList.length} pokemon of {totalPokemonCount}</p>
      </div>
    )
  };

const mapStateToProps = state => ({
  isLoading: state.pokemonListReducer.isLoading,
  error: state.pokemonListReducer.error,
  pokemonList: pokemonListFilterSelector(state),
  totalPokemonCount: pokemonListCount(state),
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchActionCreator: loadPokemonList,
      displayMore: displayMorePokemon,
    },
    dispatch,
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PokemonList);
