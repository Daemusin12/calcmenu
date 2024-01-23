const recipes = [
    {
      id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
      name: 'Adobo',
      procedure: 'lagyan ng toyo, lutuin ang manok',
      servings: 2,
      date: '2024-01-23'
    },
  ];

const ingredients = [
    {
      recipe_id: recipes[0].id,
      quantity: 1,
      unit: 'pc',
      name: 'manok',
    },
  ];

module.exports = {
    recipes,
    ingredients
  };