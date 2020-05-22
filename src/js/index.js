// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

//Global State of the App
/*
- search object
- current recipe object
- shopping list object
- liked recipes
*/

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
    
    //search fore recipes
    await state.search.getResults();

    //render results on UI
    searchView.renderResults(state.search.results);
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});
