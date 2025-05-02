'use client'

import { AnyCalculator } from "@/app/types/calculator"
import { Category } from "@/app/types/category"
import { SubCategory } from "@/app/types/subCategory"
import Breadcrumb from "@/app/ui/components/BreadCrumb"
import Calculator from "@/app/ui/components/Calculator"
import { NotesSection } from "./NotesSection"
import { FaqSection } from "./FaqSection"
import { ReferencesSection } from "./ReferencesSection"
import { OverviewSection } from "./OverviewSection"
import { useState } from "react"

export default function CalculatorContent({
    category,
    subCategory,
    calculator,
    cityInfo
}: {
    category: Category,
    subCategory: SubCategory,
    calculator: AnyCalculator,
    cityInfo?: {
        city: string,
        state: string,
        zip_code: number
    }
}) {
    const { city: cityName, state: stateName, zip_code } = cityInfo || {}
    const year = new Date().getFullYear()
    const projectType = calculator.title.replace(/costs/i, '').trim()

    const references = calculator.summarycontent
        .filter(item => item.tag === "UL")
        .flatMap(item => item.items.filter(subItem => subItem.tag === "A"))
        ;

    // label lo  puedo obtener de calculator
    let qtyLabel
    if (calculator.type === "NORMAL") qtyLabel = calculator.qtylabel
    else if (calculator.type === "SLIDERS") {
        qtyLabel = typeof calculator.variables.qu === "string" ? calculator.variables.qu : "";
    }
    else if (calculator.type === "SELECTS_SLIDERS") qtyLabel = "Quantity"

    const [qty, setQty] = useState<number>(1)
    const [lowCost, setLowCost] = useState<number | string>(0)
    const [highCost, setHighCost] = useState<number | string>(0)


    return (
        <article className="flex flex-col gap-10 max-w-[875px] p-4 pl-0 text-[#374151]">
            <Breadcrumb items={[
                { name: "Home", href: "/" },
                { name: category.name || "Unknown Category", href: `/${category.slug || ""}` },
                { name: subCategory.name || "Unknown SubCategory", href: `/${category.slug || ""}` },
                { name: calculator.name || "Unknown Name", href: `/${calculator.slug || ""}` },
            ]} />
            <h1 className='text-2xl text-[#101828] font-bold'>
                {calculator.name} Costs {cityName ? `in ${cityName}, ${stateName}` : ""} ({year}) - Free Calculator
            </h1>
            <OverviewSection
                calculatorName={calculator.name}
                city={cityName}
                state={stateName}
            />
            <Calculator
                calculator={calculator}
                cityZipCode={zip_code || 0}
                onChangeQty={(qty) => setQty(qty)}
                onChangeLowCost={(lowCost) => setLowCost(lowCost)}
                onChangeHighCost={(highCost) => setHighCost(highCost)}
            />
            <NotesSection
                calculatorName={calculator.name}
                projectType={projectType}
                year={year}
                cityName={cityName}
                stateName={stateName}
                highCost={highCost}
                lowCost={lowCost}
                qtyLabel={qtyLabel}
                qty={qty}
            />
            <FaqSection calculatorName={calculator.name} />
            <ReferencesSection references={references} />
        </article>
    )
}