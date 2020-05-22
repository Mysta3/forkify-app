// Global app controller
import Search from './models/Search';

//Global State of the App
/*
- search object
- current recipe object
- shopping list object
- liked recipes
*/

const state = {};

const controlSearch = async () =>{
 // get query from view
 const query = 'pizza'

 if(query){
     //create new search object & add to state
     state.search = new Search(query);

     //Prep UI for results

     //search fore recipes
    await  state.search.getResults();

     //render results on UI 
     console.log(state.search.results)
 }
}

document.querySelector('.search').addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
})



