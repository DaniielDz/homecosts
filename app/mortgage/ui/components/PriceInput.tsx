"use client"

import React, { useEffect, useState } from "react"
import ToolTip from "./Tooltip"
import { formatNumber } from "../../utils/formatNumber"

interface PriceInputProps {
    label: string
    value: number | string
    onChange: (value: number) => void
    prefix?: string
    suffix?: string
    tooltipText?: string
}

export function PriceInput({
    label,
    value,
    onChange,
    prefix = "",
    suffix = "",
    tooltipText,
}: PriceInputProps) {
    const [displayValue, setDisplayValue] = useState<string>("")
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        if (!isFocused) {
            const num = typeof value === "string" ? parseFloat(value) || 0 : value
            setDisplayValue(formatNumber(num,2))
        }
    }, [value, isFocused])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let text = e.target.value

        if (suffix === "%") {
            const numeric = text.replace(/[^0-9.]/g, "")
            const parts = numeric.split(".")
            if (parts.length > 2) {
                parts.pop()
            }
            text = parts.join(".")
            const num = parseFloat(text) || 0
            onChange(num)
            setDisplayValue(text)
        } else {
            const numeric = text.replace(/\D/g, "")
            const num = parseInt(numeric, 10) || 0
            onChange(num)
            setDisplayValue(numeric)
        }
    }

    const handleFocus = () => {
        setIsFocused(true)
        const num = typeof value === "string" ? parseFloat(value) || 0 : value
        setDisplayValue(String(num))
    }

    const handleBlur = () => {
        setIsFocused(false)
        const num = typeof value === "string" ? parseFloat(value) || 0 : value
        setDisplayValue(formatNumber(num,2))
    }

    return (
        <div className="flex flex-col">
            <label className="flex items-center justify-between text-sm text-gray-900 font-semibold mb-2">
                {label}
                {tooltipText && <ToolTip tooltipText={tooltipText} />}
            </label>
            <div className="relative">
                {prefix && (
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
                        {prefix}
                    </span>
                )}
                <input
                    type="text"
                    value={displayValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="block w-full rounded-md border border-gray-300 pl-7 pr-12 py-2 focus:outline-none focus:border-blue-500"
                />
                {suffix && (
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 pointer-events-none">
                        {suffix}
                    </span>
                )}
            </div>
        </div>
    )
}
