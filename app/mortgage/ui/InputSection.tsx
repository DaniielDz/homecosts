import { PriceInput } from "./components/PriceInput"
import { DownPaymentInput } from "./components/DownPaymentInput"
import { SelectInput } from "./components/SelectInput"
import { ChevronDown } from "lucide-react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

interface InputSectionProps {
    price: number
    setPrice: (value: number) => void
    downAmt: number
    setDownAmt: (value: number) => void
    downPct: number
    setDownPct: (value: number) => void
    term: string
    setTerm: (value: string) => void
    intRate: number
    setIntRate: (value: number) => void
    taxes: number
    setTaxes: (value: number) => void
    insurance: number
    setInsurance: (value: number) => void
    hoaFees: number
    setHoaFees: (value: number) => void
    onUpdate: () => void
}

export function InputSection({
    price, setPrice,
    downAmt, setDownAmt,
    downPct, setDownPct,
    term, setTerm,
    intRate, setIntRate,
    taxes, setTaxes,
    insurance, setInsurance,
    hoaFees, setHoaFees,
    onUpdate
}: InputSectionProps) {
    const [isFull, setIsFull] = useState(false)

    return (
        <>
            <section className="flex flex-col gap-6 w-full h-max max-w-80">
                <PriceInput
                    label="Home price"
                    value={price}
                    onChange={setPrice}
                    prefix="$"
                    suffix="USD"
                />
                <DownPaymentInput
                    label="Down payment"
                    currencyValue={downAmt}
                    percentValue={downPct}
                    onCurrencyChange={setDownAmt}
                    onPercentChange={setDownPct}
                />
                <SelectInput
                    label="Loan term"
                    options={[
                        { value: "10", label: "10 years" },
                        { value: "15", label: "15 years" },
                        { value: "20", label: "20 years" },
                        { value: "30", label: "30 years" },
                    ]}
                    value={term}
                    onChange={setTerm}
                />
                <PriceInput
                    label="Interest rate"
                    value={intRate}
                    onChange={setIntRate}
                    suffix="%"
                    tooltipText="This is the annual interest rate for your mortgage. It can vary based on your credit score, loan type, and lender."
                />
                <div
                    onClick={() => setIsFull((v) => !v)}
                    className="w-full max-w-max m-auto flex items-center gap-4 text-gray-900 font-normal text-sm group hover:text-blue-700 transition-all duration-300 cursor-pointer"
                >
                    Taxes, insurance, HOA fees
                    <ChevronDown
                        className={clsx(
                            "stroke-blue-600 w-5 group-hover:stroke-blue-700 transition-all duration-300",
                            isFull ? "-rotate-180" : "rotate-0"
                        )}
                    />
                </div>
                <AnimatePresence initial={false}>
                    {isFull && (
                        <motion.div
                            key="details"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden flex flex-col gap-6"
                        >
                            <PriceInput
                                label="Taxes"
                                value={taxes}
                                onChange={setTaxes}
                                prefix="$"
                                suffix="USD"
                            />
                            <PriceInput
                                label="Insurance"
                                value={insurance}
                                onChange={setInsurance}
                                prefix="$"
                                suffix="USD"
                            />
                            <PriceInput
                                label="HOA fees"
                                value={hoaFees}
                                onChange={setHoaFees}
                                prefix="$"
                                suffix="USD"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    className="w-full bg-blue-600 text-white font-semibold text-sm py-2 px-4 rounded-md shadow-md cursor-pointer hover:bg-blue-700 transition-all duration-300"
                    onClick={onUpdate}
                >
                    Update
                </button>
            </section>
        </>
    )
}