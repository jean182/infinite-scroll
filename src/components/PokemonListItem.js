import _ from "lodash";
import React from "react";

const PokemonListItem = ({ id, name }) => {
  return (
    <>
      <div>
        <img
          className="d-block mx-auto"
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
          alt={name}
        />
      </div>
      <div className="text-center">
        <p>{_.capitalize(name)}</p>
      </div>
    </>
  );
};

export default PokemonListItem;
