import { supabase } from "@/app/lib/supabase";
import type { AnyCalculator } from "@/app/types/calculator";
import { Category } from "@/app/types/category";
import { SubCategory } from "@/app/types/subCategory";

type CalculatorResult = {
    categoryData: Category;
    subCategoryData: SubCategory;
    fullCalculator: AnyCalculator;
    relatedCalculators: AnyCalculator[];
};

export async function getCalculator(
    categorySlug: string,
    calculatorSlug: string
): Promise<CalculatorResult> {
    const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", categorySlug)
        .single();

    if (categoryError || !categoryData) {
        throw new Error("Error loading category");
    }

    const { data, error: subCategoriesError } = await supabase
        .from("subcategories")
        .select("id, name")
        .eq("category_id", categoryData.id);

    const subCategoriesData: SubCategory[] = data as SubCategory[];

    if (subCategoriesError || !subCategoriesData) {
        throw new Error("Error loading subcategories");
    }

    const subCategoryIds = subCategoriesData.map((sub: SubCategory) => sub.id);

    const { data: baseData, error: baseError } = await supabase
        .from("calculators")
        .select("*")
        .eq("slug", calculatorSlug)
        .in("subcategory_id", subCategoryIds)
        .single();

    if (baseError || !baseData) {
        throw new Error("Error loading calculator");
    }

    let fullCalculator: AnyCalculator = baseData;

    if (baseData.type === "NORMAL") {
        const { data, error } = await supabase
            .from("normal")
            .select("*")
            .eq("id", baseData.id)
            .single();

        if (error || !data) throw new Error("Error loading normal calculator data");
        fullCalculator = { ...baseData, ...data };
    } else if (baseData.type === "SLIDERS") {
        const { data, error } = await supabase
            .from("sliders")
            .select("*")
            .eq("id", baseData.id)
            .single();

        if (error || !data) throw new Error("Error loading sliders calculator data");
        fullCalculator = { ...baseData, ...data };
    } else if (baseData.type === "SELECTS_SLIDERS") {
        const { data, error } = await supabase
            .from("selects_sliders")
            .select("*")
            .eq("id", baseData.id)
            .single();

        if (error || !data) throw new Error("Error loading selects_sliders calculator data");
        fullCalculator = { ...baseData, ...data };
    }

    const { data: subCategoryData, error: subCategoryError } = await supabase
        .from("subcategories")
        .select("*")
        .eq("id", baseData.subcategory_id)
        .single();

    if (subCategoryError || !subCategoryData) {
        throw new Error("Error loading calculator subcategory");
    }

    const { data: relatedCalculators, error: relatedError } = await supabase
        .from("calculators")
        .select("*")
        .eq("subcategory_id", subCategoryData.id)
        .neq("slug", calculatorSlug);
    if (relatedError || !relatedCalculators) {
        throw new Error("Error loading related calculators");
    }

    return { categoryData, subCategoryData, fullCalculator, relatedCalculators };
}
