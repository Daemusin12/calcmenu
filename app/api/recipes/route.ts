import { fetchAllRecipes } from "@/app/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await fetchAllRecipes()
  const modifiedData = data.map(recipe => {
    const { id, date, ingredients, ...rest } = recipe;
    const modifiedIngredients = ingredients.map(ingredient => {
      const { id, recipe_id, ...ingredientWithoutRecipeId } = ingredient;
      return ingredientWithoutRecipeId;
    });
    return { ...rest, ingredients: modifiedIngredients };
  });
  const jsonResponse = JSON.stringify(modifiedData);

  return NextResponse.json(modifiedData);
}