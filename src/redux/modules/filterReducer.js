const INCREMENT = "pokemon-frontend/filters/INCREMENT";

const filtersReducerDefaultState = {
  count: 20,
};

export default (state = filtersReducerDefaultState, action) => {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        count: state.count + 20,
      };
    default:
      return state;
  }
};

// Action Creators

export const increment = () => ({
  type: INCREMENT,
});
