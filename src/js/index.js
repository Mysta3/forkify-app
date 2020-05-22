// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

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
    renderLoader(elements.searchResults);

    //search fore recipes
    await state.search.getResults();

    //render results on UI
    clearLoader();
    searchView.renderResults(state.search.results);
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
