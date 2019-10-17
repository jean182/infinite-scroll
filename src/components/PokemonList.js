import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadPokemonList, loadMorePokemon } from "../redux/modules/pokemonList";
import ListItemLoader from "./ListItemLoader";
import PokemonListItem from "./PokemonListItem";
import { getId } from "../helpers/pokemonUtils";

class PokemonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCount: 20,
    };
  }

  componentDidMount() {
    const { fetchActionCreator } = this.props;
    fetchActionCreator();
  }

  handleScroll = event => {
    const { loadMoreActionCreator } = this.props;
    const { currentCount } = this.state;
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      loadMoreActionCreator(currentCount);
      this.setState({
        currentCount: currentCount + 20,
      });
    }
  };


  render() {
    const { isLoading, error, pokemonList } = this.props;
    if (_.isEmpty(pokemonList) && isLoading) return <ListItemLoader />;
    if (error) return <p>Error</p>;
    return (
      <div className="border m-5">
        <div
          className="row"
          onScroll={this.handleScroll}
          style={{ height: "500px", overflow: "auto" }}
        >
          {_.isEmpty(pokemonList) && <p>No results for this search</p>}
          {pokemonList.map(pokemon => {
            const { url, name } = pokemon;
            const id = getId(url);
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
        <p className="text-muted ml-3">Displaying {pokemonList.length} pokemon of 807</p>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isLoading: state.pokemonListReducer.isLoading,
  error: state.pokemonListReducer.error,
  pokemonList: state.pokemonListReducer.pokemonList,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchActionCreator: loadPokemonList,
      loadMoreActionCreator: loadMorePokemon,
    },
    dispatch,
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PokemonList);
