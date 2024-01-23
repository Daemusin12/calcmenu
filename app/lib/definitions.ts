export type Ingredient = {
    id: string;
    name: string;
    recipe_id: string;
    unit: string;
    quantity: number;
  };

  export type RecipeWithIngredients = {
    id: string;
    name: string;
    procedure: string;
    servings: number;
    date: string;
    ingredients: Ingredient[];
  };