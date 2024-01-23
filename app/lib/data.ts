import { sql } from '@vercel/postgres';
import {
  RecipeWithIngredients,
} from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 5;

export async function fetchFilteredRecipes(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const recipes = await sql<RecipeWithIngredients>`
        SELECT
          recipes.id,
          recipes.name,
          recipes.procedure,
          recipes.servings,
          recipes.date,
          jsonb_agg(
            jsonb_build_object(
              'id', ingredients.id,
              'recipe_id', ingredients.recipe_id,
              'name', ingredients.name,
              'unit', ingredients.unit,
              'quantity', ingredients.quantity
            )
          ) AS ingredients
        FROM recipes
        LEFT JOIN ingredients ON recipes.id = ingredients.recipe_id
        WHERE
          recipes.name ILIKE ${`%${query}%`}
        GROUP BY
          recipes.id, recipes.name, recipes.procedure, recipes.servings, recipes.date
        ORDER BY recipes.date DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;

    return recipes.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch recipes.');
  }
}

export async function fetchRecipesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
      FROM recipes
      LEFT JOIN ingredients ON recipes.id = ingredients.recipe_id
      WHERE
        recipes.name ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of recipes.');
  }
}

export async function fetchRecipeById(id: string) {
  noStore();
  try {
    const data = await sql<RecipeWithIngredients>`
      SELECT
      recipes.id,
      recipes.name,
      recipes.procedure,
      recipes.servings,
      recipes.date,
      jsonb_agg(
        jsonb_build_object(
          'id', ingredients.id,
          'recipe_id', ingredients.recipe_id,
          'name', ingredients.name,
          'unit', ingredients.unit,
          'quantity', ingredients.quantity
        )
      ) AS ingredients
    FROM recipes
    LEFT JOIN ingredients ON recipes.id = ingredients.recipe_id
        WHERE recipes.id = ${id}
        GROUP BY
        recipes.id, recipes.name, recipes.procedure, recipes.servings, recipes.date
      `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch recipe.');
  }
}