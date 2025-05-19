import mustache from "mustache"
import { useMemo } from "react"
export function NotesSection({
    calculatorName,
    projectType,
    projectName,
    year,
    cityName,
    stateName,
    qtyLabel = "",
    qty = 1,
    lowCost = 0,
    highCost = 0,
    notes = ""
}: {
    calculatorName: string,
    projectType: string,
    projectName: string,
    year: number
    cityName?: string,
    stateName?: string,
    qtyLabel?: string,
    qty?: number,
    lowCost: number | string,
    highCost: number | string,
    notes: string
}) {
    // 1. Preparamos el objeto de variables que coincida con los placeholders
    const vars = {
        month: new Date().toLocaleString('en-US', { month: 'long' }),
        year,
        projectName,
        City: cityName ?? '',
        State: stateName ?? '',
        LowEndCost: lowCost,
        HighEndCost: highCost,
        qtyLabel,
        calculatorSlug: `/calculators/${calculatorName
            .toLowerCase()
            .replace(/\s+/g, '-')}`,
        calculatorName,
    }

    // 2. Renderizamos la plantilla una sola vez cuando cambian inputs
    const renderedHtml = useMemo(
        () => notes ? mustache.render(notes, vars) : "",
        [notes, JSON.stringify(vars)]
    )


    return (
        <section className='flex flex-col gap-4 text-base'>
            {
                !notes && (
                    <p>In <strong>{year}</strong>, the estimated <strong>{projectType}</strong> starts at <strong>{typeof (lowCost) === "string" ? `${lowCost} - ${highCost}` : `$${lowCost} - $${highCost}`}</strong> per {qtyLabel}. Use our <strong>{calculatorName}</strong> for cost estimates customized to<strong>{cityName ? ` ${cityName}, ${stateName}` : ""}</strong>, <strong>{qty} {qtyLabel}</strong>, and selected materials and services.</p>
                )}

            <h2 className='text-[#111827] text-2xl font-semibold'>Notes for {calculatorName}</h2>
            {
                !notes && (
                    <>
                        <div>
                            <h3>To estimate costs for your <strong>{projectName}</strong> project:</h3>
                            <ol className='pl-2 flex flex-col gap-4'>
                                <li>
                                    <h4 className='font-bold'>1. Set Project Zip Code</h4>
                                    <p className='pl-4'>Enter the Zip Code for the location where labor is hired and materials purchased. <br /> (This will ensure the cost estimate reflects local labor rates and material availability{cityName ? <> in <strong>{cityName}, {stateName}</strong></> : ""}.)</p>
                                </li>
                                <li>
                                    <h4 className='font-bold'>2. Specify Project Size and Options</h4>
                                    <p className='pl-4'>Enter the total number of {qtyLabel} for your <strong>{projectName}</strong> project. <br />(If you&apos;re installing <strong>{projectName}</strong> in multiple rooms, sum the total area for accurate cost estimation.)</p>
                                </li>
                                <li>
                                    <h4 className='font-bold'>3. Select Materials and Labor Services</h4>
                                    <p className='pl-4'>Choose the materials (e.g., <strong>{"Premium brand"}</strong>) and any additional labor services (e.g., <strong>{"Medium cost labor"}</strong>) to include. <br />(Different materials and services may affect your total cost.)</p>
                                </li>
                                <li>
                                    <h4 className='font-bold'>4. Re-calculate</h4>
                                    <p className='pl-4'>Click the <strong>“Update”</strong> button to refresh the cost estimate based on your selections. <br />(This will update your total estimated costs for the <strong>{projectName}</strong> project.)</p>
                                </li>
                            </ol>
                        </div>
                        <div>
                            <h3 className='font-semibold'>NOTE:</h3>
                            <p>Input the total square footage for the entire area to be covered, including any areas that may require extra materials or labor, such as uneven floors or additional preparation work. Material and labor costs may vary depending on your location, so be sure to enter your Zip Code for the most accurate estimate.</p>
                        </div>
                    </>
                )
            }
            <div
                className="prose"
                // ⚠️ Como aquí confías en tu scraper, usamos dangerouslySetInnerHTML:
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
        </section>
    )
}