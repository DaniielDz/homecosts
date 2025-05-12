import { AnyCalculator } from '@/app/types/calculator';
import { getCalculator } from './lib/getCalculator';
import { Category } from '@/app/types/category';
import { SubCategory } from '@/app/types/subCategory';
import CalculatorContent from './ui/CalculatorContent';
import { AsideContent } from './ui/AsideContent';
import Breadcrumb from '@/app/ui/components/BreadCrumb';


type Params = Promise<{ category: string, calculator: string }>

export default async function CalculatorPage(props: { params: Params }) {
    const params = await props.params;
    const { category: categorySlug, calculator: calculatorSlug } = params;

    let categoryData: Category;
    let subCategoryData: SubCategory;
    let fullCalculator: AnyCalculator;
    let relatedCalculators: AnyCalculator[];

    try {
        const result = await getCalculator(categorySlug, calculatorSlug);
        ({ categoryData, subCategoryData, fullCalculator, relatedCalculators } = result);
    } catch (error) {
        // Render error state
        return (
            <div className="p-4 text-red-600">
                {(error as Error).message}
            </div>
        );
    }

    return (
        <div>
            <Breadcrumb items={[
                { name: "Home", href: "/" },
                { name: categoryData.name || "Unknown Category", href: `/${categoryData.slug || ""}` },
                { name: subCategoryData.name || "Unknown SubCategory", href: `/${categoryData.slug || ""}` },
                { name: fullCalculator.title || "Unknown Name", href: `/${fullCalculator.slug || ""}` },
            ]} />
            <section className='flex flex-col-reverse xl:flex-row justify-center lg:items-center xl:items-start'>
                <AsideContent
                    categorySlug={categorySlug}
                    relatedCalculators={relatedCalculators}
                    calculatorName={fullCalculator.name ?? "Calculator"}
                />
                <CalculatorContent
                    calculator={fullCalculator}
                />
            </section>
        </div>
    );
}