import Table from "@/app/ui/recipes/table";
import Search from "../ui/search";
import { CreateRecipe } from "../ui/recipes/buttons";
import Pagination from "../ui/recipes/pagination";
import { fetchRecipesPages } from "../lib/data";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchRecipesPages(query);

      return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={` text-2xl`}>Recipes</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <Search placeholder="Search for recipes..." />
        <CreateRecipe />
      </div>
        <Table query={query} currentPage={currentPage} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
  }