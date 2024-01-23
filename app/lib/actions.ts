'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const RecipeFormSchema = z.object({
    id: z.string(),
    name: z.string(),
    servings: z.coerce.number(),
    procedure: z.string(),
    date: z.string(),
});

const IngredientFormSchema = z.object({
    id: z.string(),
    recipe_id: z.string(),
    name: z.string(),
    quantity: z.coerce.number(),
    unit: z.string(),
});

const CreateRecipe = RecipeFormSchema.omit({ id: true, date: true });
const CreateIngredient = IngredientFormSchema.omit({ id: true })

export async function createRecipe(data: any) {
    const { name, servings, procedure, ingredients } = data
    const validatedRecipe = CreateRecipe.safeParse({
        name,
        servings,
        procedure,
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedRecipe.success) {
        return {
            errors: validatedRecipe.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Recipe.',
        };
    }

    console.log('Valid Recipe Data:', validatedRecipe);

    // Prepare data for insertion into the database
    const date = new Date().toISOString().split('T')[0];

    try {
        const recipeInserted = await sql`
          INSERT INTO recipes (name, servings, procedure, date)
          VALUES (${name}, ${servings}, ${procedure}, ${date})
          RETURNING *;
        `;
        const recipeId = recipeInserted.rows[0].id

        const insertedIngredients = await Promise.all(
            ingredients.map(
                (ingredient) => sql`
          INSERT INTO ingredients (recipe_id, name, unit, quantity)
          VALUES (${recipeId}, ${ingredient.name}, ${ingredient.unit}, ${ingredient.quantity});
        `,
            ),
        );
        console.log('Recipe and Ingredients created successfully!');
    } catch (error) {
        console.log(error)
        return {
            message: 'Database Error: Failed to Create Recipe.',
        };
    }

    revalidatePath('/recipes');
    redirect('/recipes');
}

export async function editRecipe(
    id: string,
    data: any
) {
    const { name, servings, procedure, ingredients } = data
    const validatedRecipe = CreateRecipe.safeParse({
        name,
        servings,
        procedure,
    });

    if (!validatedRecipe.success) {
        return {
            errors: validatedRecipe.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Recipe.',
        };
    }


    try {
        const recipeUpdated = await sql`
        UPDATE recipes
        SET name = ${name}, servings = ${servings}, procedure = ${procedure}
        WHERE id = ${id}
        RETURNING *;
      `;

        const recipeId = recipeUpdated.rows[0].id

        await sql`
        DELETE FROM ingredients
        WHERE recipe_id = ${recipeId}
        `;

        const insertedIngredients = await Promise.all(
            ingredients.map(
                (ingredient) => sql`
          INSERT INTO ingredients (recipe_id, name, unit, quantity)
          VALUES (${recipeId}, ${ingredient.name}, ${ingredient.unit}, ${ingredient.quantity});
        `,
            ),
        );
        console.log('Recipe and Ingredients updated successfully!')
    } catch (error) {
        return { message: 'Database Error: Failed to Update Recipe.' };
    }

    revalidatePath('/recipes');
    redirect('/recipes');
}

export async function deleteRecipe(id: string) {

    try {
        await sql`
        DELETE FROM ingredients
        WHERE recipe_id = ${id}
        `;
        await sql`
        DELETE FROM recipes 
        WHERE id = ${id}`;

        revalidatePath('/recipes');

        return { message: 'Deleted Recipe.' };
    } catch (error) {
        console.log(error)
        return { message: 'Database Error: Failed to Delete Recipe.' };
    }
}
