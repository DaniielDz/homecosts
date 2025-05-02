"use client"

import React from "react"
import ToolTip from "./Tooltip"

interface DownPaymentInputProps {
    label: string
    currencyValue: number | string
    percentValue: number | string
    onCurrencyChange: (val: number) => void
    onPercentChange: (val: number) => void
    tooltipText?: string
}

export function DownPaymentInput({
    label,
    currencyValue,
    percentValue,
    onCurrencyChange,
    onPercentChange,
}: DownPaymentInputProps) {
    const formatNumber = (val: number | string) => {
        const num = typeof val === "number" ? val : parseInt(val.toString().replace(/\D/g, ''), 10) || 0
        return num.toLocaleString()
    }

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numeric = e.target.value.replace(/\D/g, '')
        onCurrencyChange(numeric ? parseInt(numeric, 10) : 0)
    }


    return (
        <div className="flex flex-col w-full max-w-sm">
            <label className="flex items-center justify-between text-gray-900 font-normal mb-2">
                {label}
                <ToolTip tooltipText="Enter your desired down payment amount and percentage."/>
            </label>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <div className="flex items-center px-3 bg-white">
                    <span className="text-gray-500">$</span>
                </div>
                <input
                    type="text"
                    value={formatNumber(currencyValue)}
                    onChange={handleCurrencyChange}
                    className="w-1/2 px-2 py-2 focus:outline-none"
                />
                <div className="w-px bg-gray-300" />
                <input
                    type="number"
                    value={percentValue}
                    onChange={(e) => onPercentChange(parseFloat(e.target.value) || 0)}
                    className="w-1/4 px-2 py-2 text-center focus:outline-none"
                />
                <div className="flex items-center px-3 bg-white">
                    <span className="text-gray-500">%</span>
                </div>
            </div>
        </div>
    )
}
