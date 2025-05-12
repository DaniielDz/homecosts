"use client"

import React from "react"


interface ExtraPaymentsProps {
    startDate: string
    onStartDateChange: (date: string) => void
    extraMonthly: number
    onExtraMonthlyChange: (value: number) => void
    extraYearly: number
    onExtraYearlyChange: (value: number) => void
    oneTimeAmount: number
    onOneTimeAmountChange: (value: number) => void
    oneTimeDate: string
    onOneTimeDateChange: (date: string) => void
}

export function ExtraPayments({
    startDate,
    onStartDateChange,
    extraMonthly,
    onExtraMonthlyChange,
    extraYearly,
    onExtraYearlyChange,
    oneTimeAmount,
    onOneTimeAmountChange,
    oneTimeDate,
    onOneTimeDateChange,
}: ExtraPaymentsProps) {
    const formatNumber = (val: number) => val.toLocaleString()

    const handleNumberInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        callback: (n: number) => void
    ) => {
        const numeric = e.target.value.replace(/\D/g, "")
        callback(numeric ? parseInt(numeric, 10) : 0)
    }

    return (
        <div className="w-full max-w-sm bg-gray-50 shadow-md rounded-lg">
            <div className="p-6">
                <h3 className="text-sm text-gray-900 font-semibold">Optional: Make extra payments</h3>
                <p className="mt-1 text-sm text-gray-500 leading-6">
                    By adding extra payments, you can pay off your loan and save on interest.
                </p>
            </div>
            <div className="border-t border-gray-300 flex flex-col gap-4 p-6">
                {/* Loan start date */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-900 mb-2">Loan start date</label>
                    <div className="relative">
                        <input
                            type="month"
                            value={startDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            className="block w-full appearance-none border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Additional monthly payment */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-900 mb-2">Additional amount to monthly payment</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">$</span>
                        <input
                            type="text"
                            value={formatNumber(extraMonthly)}
                            onChange={(e) => handleNumberInput(e, onExtraMonthlyChange)}
                            className="block w-full border border-gray-300 rounded-md py-2 pl-8 pr-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Additional yearly payment */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-900 mb-2">Additional yearly payment</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">$</span>
                        <input
                            type="text"
                            value={formatNumber(extraYearly)}
                            onChange={(e) => handleNumberInput(e, onExtraYearlyChange)}
                            className="block w-full border border-gray-300 rounded-md py-2 pl-8 pr-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* One-time additional payment */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-900 mb-2">One-time additional payment on</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">$</span>
                            <input
                                type="text"
                                value={formatNumber(oneTimeAmount)}
                                onChange={(e) => handleNumberInput(e, onOneTimeAmountChange)}
                                className="block w-full border border-gray-300 rounded-md py-2 pl-8 pr-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="month"
                                value={oneTimeDate}
                                onChange={(e) => onOneTimeDateChange(e.target.value)}
                                className="block w-full appearance-none border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
