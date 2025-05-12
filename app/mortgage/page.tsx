"use client"

import { useEffect, useState } from "react"
import { InputSection } from "./ui/InputSection"
import { OutputSection } from "./ui/OutputSection"
import { Tabs } from "./ui/Tabs"
import { calculateMortgageResults, MortgageInputs, MortgageResults } from "./utils/calculateMortgage"
import MortgageGuide from "./ui/components/MortgageGuide"

export default function MortgagePage() {
    // Inputs
    const [price, setPrice] = useState(425000)
    const [downAmt, setDownAmt] = useState(85000)
    const [downPct, setDownPct] = useState(20)
    const [term, setTerm] = useState("30")
    const [intRate, setIntRate] = useState(6.333)
    const [taxes, setTaxes] = useState(0)
    const [insurance, setInsurance] = useState(0)
    const [hoaFees, setHoaFees] = useState(0)

    const [startDate, setStartDate] = useState("2025-04")
    const [extraMonthly, setExtraMonthly] = useState(0)
    const [extraYearly, setExtraYearly] = useState(0)
    const [oneTimeAmt, setOneTimeAmt] = useState(0)
    const [oneTimeDate, setOneTimeDate] = useState("2025-04")

    const [results, setResults] = useState<MortgageResults | null>(null)
    const [isAmortization, setIsAmortization] = useState(false)

    const onUpdate = () => {
        const inputs: MortgageInputs = {
            price,
            downPayment: downAmt,
            termYears: parseInt(term, 10),
            annualRate: intRate,
            taxes,
            insurance,
            hoaFees,
            startDate,
            extraMonthly,
            extraYearly,
            oneTimeAmount: oneTimeAmt,
            oneTimeDate,
        }
        setResults(calculateMortgageResults(inputs))
    }

    const updateDownValues = (type: "amt" | "pct", value: number) => {
        if (value < 0) {
            value = 0;
        }
        if (type === "amt") {
            if (value > price) {
                value = price;
            }
            setDownAmt(value);
            setDownPct((value / price) * 100);
        } else if (type === "pct") {
            if (value > 100) {
                value = 100;
            }
            setDownPct(value);
            setDownAmt((price * value) / 100);
        }
    };

    useEffect(() => {
        const newDownAmt = (price * downPct) / 100;
        setDownAmt(newDownAmt);
    }, [price, downPct]);

    useEffect(() => {
        onUpdate()
    }, [])


    return (
        <div className="flex flex-col items-end justify-center w-full max-w-max mx-auto px-4">
            <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-19.5 mt-[178px] mb-42.5">
                <InputSection
                    price={price} setPrice={setPrice}
                    downAmt={downAmt} setDownAmt={(value) => updateDownValues("amt", value)}
                    downPct={downPct} setDownPct={(value) => updateDownValues("pct", value)}
                    term={term} setTerm={setTerm}
                    intRate={intRate} setIntRate={setIntRate}
                    taxes={taxes} setTaxes={setTaxes}
                    insurance={insurance} setInsurance={setInsurance}
                    hoaFees={hoaFees} setHoaFees={setHoaFees}
                    onUpdate={onUpdate}
                />
                <div className="flex flex-col w-full lg:w-[834px]">
                    <div className="w-full border-b border-gray-300">
                        <Tabs
                            tabs={['Payment breakdown', 'Amortization']}
                            initialIndex={0}
                            onChange={(index) => {
                                setIsAmortization(index === 1)
                            }}
                        />
                    </div>
                    <OutputSection
                        results={results}
                        isAmortization={isAmortization}
                        startDate={startDate}
                        extraMonthly={extraMonthly}
                        extraYearly={extraYearly}
                        oneTimeAmt={oneTimeAmt}
                        oneTimeDate={oneTimeDate}
                        setStartDate={setStartDate}
                        setExtraMonthly={setExtraMonthly}
                        setExtraYearly={setExtraYearly}
                        setOneTimeAmt={setOneTimeAmt}
                        setOneTimeDate={setOneTimeDate}
                        taxes={taxes} setTaxes={setTaxes}
                        insurance={insurance} setInsurance={setInsurance}
                        hoaFees={hoaFees} setHoaFees={setHoaFees}
                    />
                </div>
            </div>
            <MortgageGuide />
        </div>
    )
}
