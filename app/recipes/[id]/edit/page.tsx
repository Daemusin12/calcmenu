import Form from '@/app/ui/recipes/edit-form';
import { fetchRecipeById } from '@/app/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [recipe] = await Promise.all([
        fetchRecipeById(id)
      ]);
  return (
    <main>
      <Form id={id} initialRecipe={recipe} />
    </main>
  );
}