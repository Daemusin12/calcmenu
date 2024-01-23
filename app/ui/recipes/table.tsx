import React from 'react';
import { fetchFilteredRecipes } from "@/app/lib/data";
import { formatDateToLocal } from '@/app/lib/utils';
import { DeleteRecipe, UpdateRecipe } from './buttons';

export default async function RecipesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const recipes = await fetchFilteredRecipes(query, currentPage);
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900 table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Servings
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Procedure
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">

              {recipes?.map((recipe) => (
                <React.Fragment key={recipe.id}>
                  <tr
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <p>{recipe.name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {recipe.servings}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {recipe.procedure}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatDateToLocal(recipe.date)}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateRecipe id={recipe.id} />
                        <DeleteRecipe id={recipe.id} />
                      </div>
                    </td>
                  </tr>
                  <tr className='flex flex-col p-2 w-full items-center justify-center'>
                    <div>Ingredients</div>
                    <td>
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th scope="col" className="px-3 py-5 font-normal">Quantity</th>
                            <th scope="col" className="px-3 py-5 font-normal">Unit</th>
                            <th scope="col" className="px-3 py-5 font-normal">Ingredient Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recipe.ingredients.map((ingredient) => (
                            <tr key={ingredient.id}>
                              <td className="whitespace-nowrap px-3 py-3">{ingredient.quantity}</td>
                              <td className="whitespace-nowrap px-3 py-3">{ingredient.unit}</td>
                              <td className="whitespace-nowrap px-3 py-3">{ingredient.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}