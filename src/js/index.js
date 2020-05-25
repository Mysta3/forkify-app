// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';
import Likes from './models/Likes';

//Global State of the App
/*
- search object
- current recipe object
- shopping list object
- liked recipes
*/

//SEARCH CONTROLLER
const state = {};

const controlSearch = async () => {
  // get query from view
  const query = searchView.getInput();
  console.log(query);

  if (query) {
    //create new search object & add to state
    state.search = new Search(query);

    //Prep UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResults);
    try {
      //search for recipes
      await state.search.getResults();

      //render results on UI
      clearLoader();
      searchView.renderResults(state.search.results);
    } catch (error) {
      clearLoader();
      alert('Something went wrong with search...');
    }
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.results, goToPage);
  }
});

//RECIPE CONTROLLER

const controlRecipe = async () => {
  //grab hash/id from url
  const id = window.location.hash.replace('#', '');
  console.log(id);

  //only do if there is an id
  if (id) {
    //prep UI for changes

    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // create new recipe object
    state.recipe = new Recipe(id);

    try {
      // get recipe data & parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      console.log(state.recipe.ingredients);

      //calc servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      //render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert('Error processing recipe!');
    }
  }
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
//same as below
['hashchange', 'load'].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

// LIST CONTTROLLER

const controlList = () => {
  //create a new list IF there is none yet
  if (!state.list) state.list = new List();

  //Add each ingredient to the List
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

//handle delete and update list item events
elements.shopping.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  //handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    //delete item form state using od
    state.list.deleteItem(id);

    //delete item from view using id
    listView.deleteItem(id);

    //handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

//Likes Controller
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();

  const currentId = state.recipe.id;

  //User has not yet like current recipe
  if (!state.likes.isLiked(currentId)) {
    //Add like to the state
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //Toggle like button

    //add like to UI list
    state.likes.deletedLike(currentId);

    //User HAS liked current recipe
  } else {
    //Remove like to the state
    //Toggle like button
    //Remove like to UI list
  }
};

//Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
  if (e.target.match('.btn-decrease, .btn-decrease *')) {
    //decrease button click

    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.match('.btn-increase, .btn-increase *')) {
    //Increased button clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
    //add ingredients to shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    //like controller
    controlLike();
  }
});
