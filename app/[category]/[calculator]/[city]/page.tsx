import { Category } from "@/app/types/category";
import { SubCategory } from "@/app/types/subCategory";
import { AnyCalculator } from "@/app/types/calculator";
import { getCalculator } from "../lib/getCalculator";
import CalculatorContent from "../ui/CalculatorContent";
import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // cache 24 h

type Params = Promise<{ category: string, calculator: string, city: string }>


export default async function CityPage(props: { params: Params }) {
    const params = await props.params;
    const { category: categorySlug, calculator: calculatorSlug, city: citySlug } = params;

    let categoryData: Category;
    let subCategoryData: SubCategory;
    let fullCalculator: AnyCalculator;

    try {
        const result = await getCalculator(categorySlug, calculatorSlug);
        ({ categoryData, subCategoryData, fullCalculator } = result);
    } catch (error) {
        return (
            <div className="p-4 text-red-600">
                {(error as Error).message}
            </div>
        );
    }

    const { data: cityRecord, error: cityError } = await supabase
        .from('zipcodes_data')
        .select('city, state, zip_code')
        .eq('slug', citySlug)
        .limit(1)
        .single()

    if (cityError || !cityRecord) {
        return (
            <div className="p-4 text-red-600">
                Error loading city:&nbsp;{cityError?.message ?? 'Not found'}
            </div>
        )
    }

    return (
        <CalculatorContent
            category={categoryData}
            subCategory={subCategoryData}
            calculator={fullCalculator}
            cityInfo={cityRecord}
        />
    );
}