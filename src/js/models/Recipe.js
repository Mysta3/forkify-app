import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );

      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      alert('Something Went Wrong:', error);
    }
  }

  calcTime() {
    //assuming we need 15mins for every 3 ingredients
    const numIngredients = this.ingredients.length;
    const periods = Math.ceil(numIngredients / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
      'cups',
      'pounds',
    ];
    const unitsShort = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound',
    ];

    const units = [...unitsShort, 'kg', 'g'];
    const newIngredients = this.ingredients.map((item) => {
      //standardize units of measurements
      let ingredient = item.toLowerCase();
      unitsLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, unitsShort[index]);
      });

      //remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      //pares ingredients into count, unit and ingredient
      const arrIngredient = ingredient.split(' '); //split into an array
      const unitIndex = arrIngredient.findIndex((item) => units.includes(item)); //returns true & the index  if element is inside array & false if not

      let objIngredient;
      if (unitIndex > -1) {
        //There is a unit
        //Ex. 4 1/2 cups, arrCount = [4, 1/2]
        //Ex. 4 , arrCount = [4]
        const arrCount = arrIngredient.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIngredient[0].replace('-', '+'));
        } else {
          count = eval(arrIngredient.slice(0, unitIndex).join('+')); //auto does arithmetic eval(" 4 +1/2") -> 4.5
        }

        objIngredient = {
          count,
          unit: arrIngredient[unitIndex],
          ingredient: arrIngredient.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(arrIngredient[0], 10)) {
        //There is no unit but 1st element is a number
        objIngredient = {
          count: parseInt(arrIngredient[0], 10),
          unit: '',
          ingredient: arrIngredient.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        //no unit

        objIngredient = {
          count: 1,
          unit: '',
          //in ES6 if key and value are the same you can just write the word
          ingredient,
        };
      }

      return objIngredient;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    //servings
    const newServings =
      type === 'dec' ? (this.servings = -1) : this.servings + 1;

    //ingredients
    this.ingredients.forEach((ing) => {
      ing.count = ing.count * (newServings / this.servings);
    });

    this.servings = newServings;
  }
}
