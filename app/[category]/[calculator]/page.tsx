import { supabase } from '@/app/lib/supabase';
import Breadcrumb from '@/app/ui/components/BreadCrumb';
import Calculator from '@/app/ui/components/Calculator';
import Link from 'next/link';
import { AnyCalculator } from '@/app/types/calculator';

interface CalculatorPageProps {
    params: {
        category: string
        calculator: string
    }
}

export default async function CalculatorPage({
    params,
}: CalculatorPageProps) {
    const resolvedParams = await Promise.resolve(params);

    const { category: categorySlug, calculator: calculatorSlug } = resolvedParams;

    // 1. Obtener la categoría a partir de su slug
    const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .single();

    if (categoryError || !categoryData) {
        console.error(categoryError);
        return <div>Error loading category</div>;
    }

    // 2. Obtener todas las subcategorías de la categoría obtenida
    const { data: subCategoriesData, error: subCategoriesError } = await supabase
        .from('subcategories')
        .select('id, name')
        .eq('category_id', categoryData.id);

    if (subCategoriesError || !subCategoriesData) {
        console.error(subCategoriesError);
        return <div>Error loading subcategories</div>;
    }

    // Extraer los IDs de las subcategorías
    const subCategoryIds = subCategoriesData.map((sub: any) => sub.id);

    // 3. Buscar la calculadora filtrando por su slug y que su subcategoria pertenezca a la lista
    const { data: baseData, error: baseError } = await supabase
        .from('calculators')
        .select('*')
        .eq('slug', calculatorSlug)
        .in('subcategory_id', subCategoryIds)
        .single();

    if (baseError || !baseData) {
        console.error(baseError);
        return <div>Error loading calculator</div>;
    }

    let fullCalculator: AnyCalculator = baseData;

    // 4. Obtener los campos específicos según el type
    if (baseData.type === 'NORMAL') {
        const { data: normalData, error: normalError } = await supabase
            .from('normal')
            .select('*')
            .eq('id', baseData.id)
            .single();

        if (normalError) {
            console.error(normalError);
            return <div>Error loading normal calculator data</div>;
        }
        fullCalculator = { ...baseData, ...normalData };
    } else if (baseData.type === 'SLIDERS') {
        const { data: slidersData, error: slidersError } = await supabase
            .from('sliders')
            .select('*')
            .eq('id', baseData.id)
            .single();

        if (slidersError) {
            console.error(slidersError);
            return <div>Error loading sliders calculator data</div>;
        }
        fullCalculator = { ...baseData, ...slidersData };
    } else if (baseData.type === 'SELECTS_SLIDERS') {
        const { data: selectsData, error: selectsError } = await supabase
            .from('selects_sliders')
            .select('*')
            .eq('id', baseData.id)
            .single();

        if (selectsError) {
            console.error(selectsError);
            return <div>Error loading selects_sliders calculator data</div>;
        }
        fullCalculator = { ...baseData, ...selectsData };
    }

    // 5. Obtener la subcategoría exacta de la calculadora (basada en baseData.subcategory_id)
    const { data: subCategoryData, error: subCategoryError } = await supabase
        .from('subcategories')
        .select('*')
        .eq('id', baseData.subcategory_id)
        .single();

    if (subCategoryError || !subCategoryData) {
        console.error(subCategoryError);
        return <div>Error loading sub-category</div>;
    }

    const year = new Date().getFullYear()
    const projectType = fullCalculator.title.replace(/costs/i, '').trim();

    const references = fullCalculator.summarycontent
        .filter(item => item.tag === "UL")
        .flatMap(item => item.items.filter(subItem => subItem.tag === "A"));


    return (
        <article className="flex flex-col gap-10 max-w-[875px] mx-auto p-4 text-[#374151]">
            <Breadcrumb items={[
                { name: "Home", href: "/" },
                { name: categoryData.name || "Unknown Category", href: `/${categoryData.slug || ""}` },
                { name: subCategoryData.name || "Unknown SubCategory", href: `/${categoryData.slug || ""}` },
                { name: fullCalculator.name || "Unknown Name", href: `/${fullCalculator.slug || ""}` },
            ]} />
            <h1 className='text-2xl text-[#101828] font-bold'>{fullCalculator.name} Costs in {"city"}, {"state"} ({year}) - Free Calculator</h1>
            <section className='flex flex-col gap-4'>
                <p>
                    Wondering how much it costs to <strong>{fullCalculator.name.replace(/calculator/i, '').trim()} in {"city"}, {"state"}</strong>? Use our free <strong>{fullCalculator.name}</strong> to get a fast, accurate estimate based on <strong>real-time material and labor costs</strong> in your area. Whether you&apos;re budgeting for a small <strong>DIY project</strong> or <strong>hiring a professional contractor</strong>, our tool helps you plan with confidence.
                </p>
                <div>
                    <h3>Our estimates include:</h3>
                    <ul className='pl-1'>
                        <li>✅ <span className='font-semibold'>Material costs</span> (low, mid, and high-end options)</li>
                        <li>✅ <span className='font-semibold'>Labor costs</span> (varies by region and complexity)</li>
                        <li>✅ <span className='font-semibold'>Total project cost range</span> for better budgeting</li>
                        <li>✅ <span className='font-semibold'>Additional factors</span> that may affect your final price</li>
                    </ul>
                </div>
                <p className='font-semibold'>👇 Simply enter your details below to get an instant estimate! 👇</p>
            </section>
            <Calculator calculator={fullCalculator} />
            <section className='flex flex-col gap-4'>
                <h2 className='text-[#111827] text-2xl font-semibold'>Notes for {fullCalculator.name}</h2>
                <p>In <strong>{year}</strong>, the estimated cost to <strong>{projectType}</strong> starts at <strong>{"costLow"} - {"costHigh"}</strong> per square foot. Use our <strong>{projectType}</strong> Cost Calculator for cost estimates customized to <strong>{"city"}, {"state"}, {"squareFeet"}</strong> square feet, and selected materials and services.</p>
                <div>
                    <h3>To estimate costs for your <strong>{projectType}</strong> project:</h3>
                    <ol className='pl-2 flex flex-col gap-4'>
                        <li>
                            <h4 className='font-bold'>1. Set Project Zip Code</h4>
                            <p className='pl-4'>Enter the Zip Code for the location where labor is hired and materials purchased. <br /> (This will ensure the cost estimate reflects local labor rates and material availability in <strong>{"city"}, {"state"}</strong>.)</p>
                        </li>
                        <li>
                            <h4 className='font-bold'>2. Specify Project Size and Options</h4>
                            <p className='pl-4'>Enter the total number of square feet for your <strong>{projectType}</strong> project. <br />(If you&apos;re installing <strong>{projectType}</strong> in multiple rooms, sum the total area for accurate cost estimation.)</p>
                        </li>
                        <li>
                            <h4 className='font-bold'>3. Select Materials and Labor Services</h4>
                            <p className='pl-4'>Choose the materials (e.g., <strong>{"materialType"}</strong>) and any additional labor services (e.g., <strong>{"laborService"}</strong>) to include. <br />(Different materials and services may affect your total cost.)</p>
                        </li>
                        <li>
                            <h4 className='font-bold'>4. Re-calculate</h4>
                            <p className='pl-4'>Click the <strong>“Update”</strong> button to refresh the cost estimate based on your selections. <br />(This will update your total estimated costs for the <strong>{fullCalculator.name}</strong> project.)</p>
                        </li>
                    </ol>
                </div>
                <div>
                    <h3 className='font-semibold'>NOTE:</h3>
                    <p>Input the total square footage for the entire area to be covered, including any areas that may require extra materials or labor, such as uneven floors or additional preparation work. Material and labor costs may vary depending on your location, so be sure to enter your Zip Code for the most accurate estimate.</p>
                </div>
            </section>
            <section>
                <h2 className='text-[#111827] text-2xl font-bold mb-4 '>Frequently Asked Questions About {fullCalculator.name}</h2>
                <ol>
                    <li>
                        <h3 className='pl-3 text-[20px] font-semibold mb-4'>1. What is the first question someone would ask?</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non nulla sit amet felis laoreet feugiat. Sed sit amet tincidunt metus, ac lobortis mi. Nunc auctor, ligula sit amet vestibulum facilisis. Ut vehicula lectus id leo lobortis, non placerat nulla egestas. Fusce feugiat, eros non ullamcorper sollicitudin.</p>
                    </li>
                </ol>
            </section>
            <section>
                <h2 className='text-[#111827] text-2xl font-bold mb-4'>References</h2>
                <ul className='list-disc pl-6'>
                    {
                        references.map((reference, index) => (
                            <li key={index}>
                                <Link className='text-[#2563EB] underline decoration-[#2563EB] hover:text-[#1E40AF] hover:decoration-[#1E40AF] transition-colors duration-200' href={reference.url} target='_blank'>{reference.text}</Link>
                                {reference.afterText}
                            </li>
                        ))
                    }
                    {/* <li>
                        <Link className='text-[#2563EB] underline decoration-[#2563EB] hover:text-[#1E40AF] hover:decoration-[#1E40AF] transition-colors duration-200' href={"#"}>Product and Supplies Data: Menards Drywall Products and Supplies </Link>
                        Menards, Jan 2025, Website
                    </li> */}
                </ul>
            </section>
        </article>
    );
}