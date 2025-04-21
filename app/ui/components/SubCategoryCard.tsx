import { Calculator } from "@/app/types/calculator";
import SubCategoryDropdown from "./SubCategoryDropdown";
import { SubCategory } from "@/app/types/subCategory";
import { supabase } from "@/app/lib/supabase";

export default async function SubCategoryCard({
  subCategory,
  categorySlug,
}: {
  subCategory: SubCategory;
  categorySlug: string;
}) {
  const { data, error } = await supabase
    .from("calculators")
    .select("*")
    .eq("subcategory_id", subCategory.id)
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    <div>Error loading calculators</div>;
  }

  const calculators: Calculator[] = data || [];

  return (
    <div className="w-full border-2 border-gray-300 rounded-md shadow hover:shadow-lg transition-all duration-300">
      <SubCategoryDropdown
        calculators={calculators}
        categorySlug={categorySlug}
        subCategoryName={subCategory.name}
      />
    </div>
  );
}