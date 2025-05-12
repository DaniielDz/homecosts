'use client'

import { AnyCalculator } from "@/app/types/calculator"
import Calculator from "@/app/ui/components/Calculator"
import { NotesSection } from "./NotesSection"
import { FaqSection } from "./FaqSection"
import { ReferencesSection } from "./ReferencesSection"
import { OverviewSection } from "./OverviewSection"
import { useEffect, useState } from "react"

export default function CalculatorContent({
    calculator,
    cityInfo
}: {
    calculator: AnyCalculator,
    cityInfo?: {
        city: string,
        state: string,
        zip_code: number
    }
}) {
    const [zipCodeValue, setZipCodeValue] = useState<number>(cityInfo?.zip_code || 10001)
    const [city, setCity] = useState<string>(cityInfo?.city || "")
    const [state, setState] = useState<string>(cityInfo?.state || "")
    const [qty, setQty] = useState<number>(1)
    const [lowCost, setLowCost] = useState<number | string>(0)
    const [highCost, setHighCost] = useState<number | string>(0)


    const year = new Date().getFullYear()
    const projectType = calculator.title.replace(/costs/i, '').trim()

    const references = calculator.summarycontent
        .filter(item => item.tag === "UL")
        .flatMap(item => item.items.filter(subItem => subItem.tag === "A"))

    let qtyLabel = ''
    if (calculator.type === "NORMAL") qtyLabel = calculator.qtylabel
    else if (calculator.type === "SLIDERS") {
        qtyLabel = typeof calculator.variables.qu === "string" ? calculator.variables.qu : ''
    } else if (calculator.type === "SELECTS_SLIDERS") qtyLabel = "Quantity"

    useEffect(() => {
        const fetchCityInfo = async () => {
            try {
                const response = await fetch(`/api/getCity?zip=${zipCodeValue}`)
                if (!response.ok) throw new Error(`Error: ${response.status}`)
                const data = await response.json()
                setCity(data.city)
                setState(data.state)
            } catch (error) {
                console.error("Error fetching city info:", error)
            }
        }
        fetchCityInfo()
    }, [zipCodeValue])

    return (
        <article className="flex flex-col gap-10 w-full p-4 lg:max-w-[875px] xl:w-[70%] xl:max-w-max xl:pr-40 lg:pl-0 text-[#374151]">
            <h1 className='text-2xl text-[#101828] font-bold'>
                {`${calculator.title} ${city ? `in ${city}, ${state}` : ''} (${year})`}
            </h1>

            <OverviewSection
                title={calculator.title}
                calculatorName={calculator.name}
                city={city}
                state={state}
            />

            <Calculator
                calculator={calculator}
                cityZipCode={zipCodeValue}
                onChangeZipCode={(zip) => setZipCodeValue(Number(zip))}
                onChangeQty={setQty}
                onChangeLowCost={setLowCost}
                onChangeHighCost={setHighCost}
            />

            <NotesSection
                calculatorName={calculator.name}
                projectType={projectType}
                year={year}
                cityName={city}
                stateName={state}
                highCost={highCost}
                lowCost={lowCost}
                qtyLabel={qtyLabel}
                qty={qty}
            />

            {
                calculator.faqs && (
                    <FaqSection
                        calculatorName={calculator.listName}
                        faqs={calculator.faqs}
                    />
                )
            }

            <ReferencesSection
                references={references}
            />
        </article>
    )
}
