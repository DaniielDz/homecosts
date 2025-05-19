"use client"

import Image from "next/image"
import React, { useState, useMemo } from "react"
import { formatNumber } from "../../utils/formatNumber"

interface ScheduleEntry {
    date: string 
    principal: number
    interest: number
    balance: number
}

interface AmortizationScheduleProps {
    schedule: ScheduleEntry[]
    annualSummary: {
        year: number
        principal: number
        interest: number
    }[]
    startDate: string
    onStartDateChange: (date: string) => void
}

export function AmortizationSchedule({
    schedule,
    annualSummary,
    startDate,
    onStartDateChange
}: AmortizationScheduleProps) {

    const [expandAll, setExpandAll] = useState(false)
    const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set())

    const lastPayment = useMemo(() => {
        if (!schedule.length) return ""
        const last = schedule[schedule.length - 1].date  
        const [y, m] = last.split("-").map(Number)
        const dLocal = new Date(y, m - 1, 1)
        return dLocal.toLocaleString("en-US", {
            month: "short",
            year: "numeric",
        })
    }, [schedule])


    const grouped = useMemo(() => {
        const map = new Map<string, ScheduleEntry[]>();
        schedule.forEach((entry) => {
            const [y, m] = entry.date.split("-").map(Number);
            const dateLocal = new Date(y, m - 1, 1);
            const year = dateLocal.getFullYear().toString();
            const arr = map.get(year) || [];
            arr.push(entry);
            map.set(year, arr);
        });
        return map;
    }, [schedule]);



    const toggleYear = (year: string) => {
        const next = new Set(expandedYears)
        if (expandedYears.has(year)) next.delete(year)
        else next.add(year)
        setExpandedYears(next)
    }

    React.useEffect(() => {
        if (expandAll) {
            setExpandedYears(new Set(grouped.keys()))
        } else {
            setExpandedYears(new Set())
        }
    }, [expandAll, grouped])

    return (
        <div className="w-full border-t-2 border-gray-200 mt-10 pt-6">
            <h2 className="text-xl font-semibold text-gray-900">
                Amortization schedule breakdown
            </h2>
            <p className="text-sm md:text-base text-gray-500 font-semibold mt-2 mb-6">
                This table lists how much principal and interest are paid in each scheduled mortgage payment.
            </p>

            {/* Header controls */}
            <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="flex items-end gap-5 ">
                    <div className="relative h-full">
                        <label className="flex flex-col gap-2 text-sm md:text-base text-gray-900 font-medium" htmlFor="firstPayment">First Payment
                            <input
                                id="firstPayment"
                                type="month"
                                value={startDate}
                                onChange={(e) => onStartDateChange(e.target.value)}
                                className="border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </label>
                    </div>
                    <Image src={"/arrowRight.svg"} alt="Arrow right" width={24} height={24} className="w-8 h-8" />
                    <div className="h-full flex flex-col justify-between gap-3">
                        <label className="text-sm md:text-base text-gray-900 font-medium">Last Payment</label>
                        <span className="text-2xl font-bold text-gray-900">{lastPayment}</span>
                    </div>
                </div>
                <label className="relative mt-10 lg:mt-0 inline-flex items-center cursor-pointer">
                    <span className="mr-3 text-sm md:text-base text-gray-900">Expand all years</span>
                    <input
                        type="checkbox"
                        checked={expandAll}
                        onChange={(e) => setExpandAll(e.target.checked)}
                        className="sr-only peer"
                    />
                    {/* Track */}
                    <span className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600  transition-colors duration-200"></span>
                    {/* Thumb */}
                    <span className="absolute left-[77%] top-[2px] w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform duration-200"></span>
                </label>

            </div>

            {/* Table */}
            <div className="mt-6 overflow-x-auto">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="text-sm md:text-base text-gray-900 border-b border-gray-300">
                            <th className="text-left py-6">Date</th>
                            <th className="text-center py-6">Principal</th>
                            <th className="text-center py-6">Interest</th>
                            <th className="text-right py-6">Remaining balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...grouped.entries()].map(([year, entries]) => {
                            const summary = annualSummary.find((s) => s.year.toString() === year)
                            const totalPrincipal = summary ? summary.principal : 0
                            const totalInterest = summary ? summary.interest : 0
                            const lastBalance = entries[entries.length - 1].balance
                            const isExpanded = expandedYears.has(year)

                            return (
                                <React.Fragment key={year}>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => toggleYear(year)}>
                                        <td className="py-5 text-blue-600 text-sm md:text-base font-medium">{isExpanded ? "- " : "+ "}{year}</td>
                                        <td className="text-center py-5 text-sm md:text-base text-gray-700">
                                            ${formatNumber(totalPrincipal, 2)}
                                        </td>
                                        <td className="text-center py-5 text-sm md:text-base text-gray-700">
                                            ${formatNumber(totalInterest, 2)}
                                        </td>
                                        <td className="text-right py-5 text-sm md:text-base text-gray-700">
                                            ${formatNumber(lastBalance, 2)}
                                        </td>
                                    </tr>
                                    {isExpanded && entries.map((e) => {
                                        const [y, m] = e.date.split("-").map(Number)
                                        const dLocal = new Date(y, m - 1, 1)
                                        const monthLabel = dLocal.toLocaleString("en-US", {
                                            month: "short",
                                            year: "numeric",
                                        })

                                        return (
                                            <tr key={e.date} className="border-b border-gray-100">
                                                <td className="pl-6 py-2 text-sm md:text-base text-gray-700">{monthLabel}</td>
                                                <td className="text-center py-2 text-sm md:text-base text-gray-700">
                                                    ${formatNumber(e.principal, 2)}
                                                </td>
                                                <td className="text-center py-2 text-sm md:text-base text-gray-700">
                                                    ${formatNumber(e.interest, 2)}
                                                </td>
                                                <td className="text-right py-2 text-sm md:text-base text-gray-700">
                                                    ${formatNumber(e.balance, 2)}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
