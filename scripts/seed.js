const { db } = require('@vercel/postgres');
const { recipes, ingredients } = require('../app/lib/placeholder-data');

async function createRecipeTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "recipes" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS recipes (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      procedure VARCHAR(255) NOT NULL,
      servings INT NOT NULL,
      date DATE NOT NULL
    );
  `;

    console.log(`Created "recipes" table`);

    // Insert data into the "recipes" table

    const insertedRecipes = await Promise.all(
      recipes.map(
        (recipe) => client.sql`
          INSERT INTO recipes (id, name, procedure, servings, date)
          VALUES (${recipe.id}, ${recipe.name}, ${recipe.procedure}, ${recipe.servings}, ${recipe.date})
          ON CONFLICT (id) DO NOTHING;
          `,
      ),
    );

    console.log(`Seeded ${insertedRecipes.length} recipes`);

    return {
      createTable,
      recipes: insertedRecipes,
    };

  } catch (error) {
    console.error('Error creating recipes table:', error);
    throw error;
  }
}

async function createIngredientsTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "ingredients" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS ingredients (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      recipe_id UUID NOT NULL,
      name VARCHAR(255) NOT NULL,
      unit VARCHAR(50) NOT NULL,
      quantity INT NOT NULL
    );
  `;

    console.log(`Created "ingredients" table`);

    // Insert data into the "ingredients" table

    const insertedIngredients = await Promise.all(
      ingredients.map(
        (ingredient) => client.sql`
          INSERT INTO ingredients (recipe_id, name, unit, quantity)
          VALUES (${ingredient.recipe_id}, ${ingredient.name}, ${ingredient.unit}, ${ingredient.quantity})
          ON CONFLICT (id) DO NOTHING;
          `,
      ),
    );

    console.log(`Seeded ${insertedIngredients.length} ingredients`);

    return {
      createTable,
      ingredients: insertedIngredients,
    };
  } catch (error) {
    console.error('Error creating ingredients table:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await createRecipeTable(client);
  await createIngredientsTable(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to create tables in the database:',
    err,
  );
});