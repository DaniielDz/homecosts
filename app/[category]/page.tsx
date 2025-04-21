import { supabase } from "../lib/supabase";
import { SubCategory } from "../types/subCategory";
import SubCategoryCard from "../ui/components/SubCategoryCard";

type Params = Promise<{ category: string}>


export default async function CategoryPage(props: { params: Params }) {
  const params = await props.params;
  const { category: categorySlug } = params;

  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", categorySlug)
    .single();

  if (categoryError || !categoryData) {
    console.error(categoryError);
    return <div>Error loading category</div>;
  }

  const categoryId = categoryData.id;
  
  const { data: subCategoriesData, error: subCategoryError } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", categoryId)
    .order("name", { ascending: true });

  if (subCategoryError) {
    console.error(subCategoryError);
    return <div>Error loading subcategories</div>;
  }

  const subCategories: SubCategory[] = subCategoriesData || [];

  return (
    <div className="p-4 space-y-4">
      <div className="md:mt-10 md:w-[480px] mx-auto flex flex-col items-center justify-center gap-6">
        {subCategories.map((subCat) => (
          <SubCategoryCard
            key={subCat.id}
            subCategory={subCat}
            categorySlug={categorySlug}
          />
        ))}
      </div>
    </div>
  );
}