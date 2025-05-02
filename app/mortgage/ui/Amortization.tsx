import { useState } from "react";
import { AmortizationCard } from "./components/AmortizationCard";
import { ExtraPayments } from "./components/ExtraPayments";
import { LinealChart } from "./components/LinealChart";
import { AmortizationSchedule } from "./components/AmortizationSchedule";
import type { LineDatum, ScheduleEntry, Summary } from "../utils/calculateMortgage"
import { formatNumber } from "../utils/formatNumber";

export interface AmortizationProps {
    startDate: string;
    extraMonthly: number;
    extraYearly: number;
    oneTimeAmt: number;
    oneTimeDate: string;
    setStartDate: (date: string) => void;
    setExtraMonthly: (value: number) => void;
    setExtraYearly: (value: number) => void;
    setOneTimeAmt: (value: number) => void;
    setOneTimeDate: (date: string) => void;
    // New props
    schedule: ScheduleEntry[]
    summary: Summary
    lineChartData: LineDatum[]
}

export function Amortization({
    startDate,
    extraMonthly,
    extraYearly,
    oneTimeAmt,
    oneTimeDate,
    setStartDate,
    setExtraMonthly,
    setExtraYearly,
    setOneTimeAmt,
    setOneTimeDate,
    schedule,
    summary,
    lineChartData
}: AmortizationProps) {
    const [first, setFirst] = useState("2025-04");

    return (
        <div className="flex flex-col w-full h-full mt-6">
            <h2 className="mb-2 text-xl text-gray-900 font-semibold text-left">Amortization for mortgage loan</h2>
            <p className="text-sm leading-7 font-semibold text-gray-500 w-full max-w-[810px]">Amortization is paying off debt over time in equal installments. As the term of your mortgage loan progresses, a larger
                share of your payment goes toward paying down the principal until the loan is paid in full at the end of your term.</p>
            <div className="grid grid-cols-2 justify-items-center md:flex gap-2 mt-6">
                <AmortizationCard title="Loan amount" value={`$${formatNumber(summary.loanAmount, 0)}`} />
                <AmortizationCard title="Total interest paid" value={`$${formatNumber(summary.totalInterest, 0)}`} />
                <AmortizationCard title="Total cost of loan" value={`$${formatNumber(summary.totalCost, 0)}`} />
                <AmortizationCard title="Payoff date" value={summary.payoffDate} />
            </div>
            <div className="w-full flex flex-col lg:flex-row items-center gap-10 mt-10">
                <LinealChart
                    data={lineChartData}
                    xKey="date"
                    series={[
                        { key: "principalPaid", label: "Principal paid", color: "#2B7FFF" },
                        { key: "interestPaid", label: "Interest paid", color: "#00C950" },
                        { key: "loanBalance", label: "Loan balance", color: "#FB2C36" },
                    ]}
                />


                <ExtraPayments
                    startDate={startDate}
                    onStartDateChange={setStartDate}
                    extraMonthly={extraMonthly}
                    onExtraMonthlyChange={setExtraMonthly}
                    extraYearly={extraYearly}
                    onExtraYearlyChange={setExtraYearly}
                    oneTimeAmount={oneTimeAmt}
                    onOneTimeAmountChange={setOneTimeAmt}
                    oneTimeDate={oneTimeDate}
                    onOneTimeDateChange={setOneTimeDate}
                />
            </div>
            <AmortizationSchedule
                schedule={schedule}
                firstPayment={first}
                onFirstPaymentChange={setFirst}
            />
        </div>
    );
}
