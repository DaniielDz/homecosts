import { MortgageResults } from "../utils/calculateMortgage";
import { Amortization } from "./Amortization";
import { PaymentDetails } from "./components/PaymentDetails";
import { PieChartText } from "./components/PieChart";

interface outputSectionProps {
    results: MortgageResults | null
    isAmortization: boolean,
    startDate: string,
    extraMonthly: number,
    extraYearly: number,
    oneTimeAmt: number,
    oneTimeDate: string,
    setStartDate: (date: string) => void,
    setExtraMonthly: (value: number) => void,
    setExtraYearly: (value: number) => void,
    setOneTimeAmt: (value: number) => void,
    setOneTimeDate: (date: string) => void
    taxes: number
    setTaxes: (value: number) => void
    insurance: number
    setInsurance: (value: number) => void
    hoaFees: number
    setHoaFees: (value: number) => void
}

export function OutputSection({
    results,
    taxes, setTaxes,
    insurance, setInsurance,
    hoaFees, setHoaFees,
    isAmortization,
    startDate,
    extraMonthly,
    extraYearly,
    oneTimeAmt,
    oneTimeDate,
    setStartDate,
    setExtraMonthly,
    setExtraYearly,
    setOneTimeAmt,
    setOneTimeDate
}: outputSectionProps) {

    if (!results) {

        return (
            <div className="flex flex-col items-center justify-center w-full h-full mt-10">
                <div className="text-center">
                    <h2 className="text-gray-700 text-lg font-medium">No Results Found</h2>
                    <p className="text-gray-500 text-sm md:text-base mt-2">Please adjust your inputs and click on Update to see the results.</p>
                </div>
            </div>
        );
    }

    const { paymentBreakdown, amortizationSchedule, summary, annualSummary } = results

    return (
        isAmortization ? (
            <Amortization
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
                schedule={amortizationSchedule}
                summary={summary}
                lineChartData={results.lineChartData}
                annualSummary={annualSummary}
            />
        ) : (
            <div className="flex flex-col w-full h-full mt-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-gray-900 text-xl font-semibold">Monthly payment breakdown</h2>
                    <p className="text-gray-500 text-sm md:text-base">Based on national average rates</p>
                </div>
                <div className="flex flex-col items-center md:flex-row md:items-start justify-between gap-6">
                    <PieChartText
                        data={[
                            { browser: "Principal & interest", visitors: paymentBreakdown.principalInterest, fill: "#2B7FFF" },
                            { browser: "Property tax", visitors: paymentBreakdown.propertyTax, fill: "#00C950" },
                            { browser: "Insurance", visitors: paymentBreakdown.insurance, fill: "#8E51FF" },
                            { browser: "HOA fees", visitors: paymentBreakdown.hoaFees, fill: "#00b8db" },
                        ]}
                        total={Math.round(paymentBreakdown.totalMonthly)}
                        label="/mo"
                    />


                    <PaymentDetails
                        principal={results.monthlyPaymentPI}
                        taxes={taxes || 0}
                        insurance={insurance || 0}
                        setInsurance={setInsurance}
                        setTaxes={setTaxes}
                        hoaFees={hoaFees}
                        setHoaFees={setHoaFees}
                    />
                </div>
            </div>
        )
    );
}