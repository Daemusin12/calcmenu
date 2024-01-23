'use client';

import { editRecipe } from '@/app/lib/actions';
import { useState, useEffect } from 'react';

type RecipeType = {
    name: string;
    servings: string;
    procedure: string;
    ingredients: { name: string; quantity: string; unit: string }[];
  };

export default function EditRecipeForm({ id, initialRecipe }: { id: any; initialRecipe: any }) {
    const [recipe, setRecipe] = useState({
        name: '',
        servings: '',
        procedure: '',
        ingredients: [{ name: '', quantity: '', unit: '' }],
    });

    useEffect(() => {
        if (initialRecipe) {
            // Set the form fields with initial recipe data when in edit mode
            setRecipe(initialRecipe);
        }
    }, [initialRecipe]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        const updatedIngredients: { [key: string]: string }[] = [...recipe.ingredients];
        updatedIngredients[index][name] = value;

        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            ingredients: updatedIngredients,
          } as RecipeType));
    };

    const handleAddIngredient = () => {
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            ingredients: [...prevRecipe.ingredients, { name: '', quantity: '', unit: '' }],
        }));
    };

    const handleRemoveIngredient = (index: number) => {
        const updatedIngredients = [...recipe.ingredients];
        updatedIngredients.splice(index, 1);

        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            ingredients: updatedIngredients,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await editRecipe(id, recipe);
        } catch (error) {
            console.error('Error updating recipe:', error);

        }
    };

    return (
        <form onSubmit={handleSubmit} className='bg-gray-200'>
            <div className='flex flex-row'>
                <div className="flex flex-col items-center justify-center w-[700px]">
                    <div className='flex flex-col m-4'>
                        <label className='w-[200px]'>
                            Recipe Name:
                            <input className="p-2 rounded-lg  h-[35px] w-[200px] border-gray-200 text-gray-700 text-[15px]" type="text" name="name" value={recipe.name} onChange={(e) => setRecipe({ ...recipe, name: e.target.value })} />
                        </label>
                    </div>
                    <div className='flex flex-col m-4'>
                        <label className='w-[200px]'>
                            Servings:
                            <input className="p-2 rounded-lg h-[35px] w-[200px] text-gray-700 text-[15px]" type="text" name="servings" value={recipe.servings} onChange={(e) => setRecipe({ ...recipe, servings: e.target.value })} />
                        </label>
                    </div>
                    <div className='flex flex-col m-4'>
                        <label className='w-[200px]'>
                            Procedure:
                            <textarea className="p-2 rounded-lg w-[300px] h-[250px] text-gray-700 text-[15px]" name="procedure" value={recipe.procedure} onChange={(e) => setRecipe({ ...recipe, procedure: e.target.value })} />
                        </label>
                    </div>
                </div>
                <div className='flex flex-col items-center w-[700px]'>
                    <h2 className='m-2'>Ingredients</h2>
                    <table className="m-2 bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Ingredient Name</th>
                                <th className="py-2 px-4 border-b">Quantity</th>
                                <th className="py-2 px-4 border-b">Unit</th>
                                <th className="py-2 px-4 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipe.ingredients.map((ingredient, index) => (
                                <tr key={index} className={'bg-gray-100'}>
                                    <td className="py-2 px-4 border-b">
                                        <input
                                            type="text"
                                            name="name"
                                            value={ingredient.name}
                                            onChange={(e) => handleInputChange(e, index)}
                                            className="w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <input
                                            type="text"
                                            name="quantity"
                                            value={ingredient.quantity}
                                            onChange={(e) => handleInputChange(e, index)}
                                            className="w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <input
                                            type="text"
                                            name="unit"
                                            value={ingredient.unit}
                                            onChange={(e) => handleInputChange(e, index)}
                                            className="w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveIngredient(index)}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        type="button"
                        onClick={handleAddIngredient}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add Ingredient
                    </button>
                </div>
            </div>
            <div className='flex items-center justify-center m-5'>
                <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
                    Update Recipe
                </button>
            </div>
        </form>
    );
}