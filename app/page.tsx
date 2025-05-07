import { supabase } from "./lib/supabase";
import SearchForm from "./ui/components/SearchForm";

export default async function Home() {
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .order("name")
    .in("name", ["Project Costs", "Services", "Maintenance Costs"]);

  if (categoriesError) {
    console.error(categoriesError);
  }
  

  const { data: subcategories, error: subcategoryError } = await supabase
    .from("subcategories")
    .select("*")
    .order("name");

  if (subcategoryError) {
    console.error(subcategoryError);
  }

  return (
    <div className="h-[calc(100dvh-64px)] w-full bg-[url('/homeBgImage.webp')] bg-cover bg-center relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-30 px-2.5 md:px-5">
        <h1 className="max-w-4xl text-center text-3xl md:text-6xl text-white font-bold">Get Accurate Home Project Estimates in Seconds</h1>
        <p className="text-center text-lg md:text-xl text-gray-200">1,000+ home improvement calculators for remodeling, repairs, and installations. <br /> Get localized costs for materials, time, and labor in your ZIP code.</p>
        <SearchForm
          categories={categories || []}
          subcategories={subcategories || []}
        />
      </div>
      <div className="absolute inset-0 bg-[#1F2937]/45" />
    </div>
  )
}