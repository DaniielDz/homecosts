"use client"

import React from "react"
import ToolTip from "./Tooltip"

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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
    
        if (suffix === "%") {
            // Permite solo números y un punto decimal, y evita múltiples puntos
            const numeric = inputValue.replace(/[^0-9.]/g, "")
            const valid = numeric.split('.').length <= 2 ? numeric : numeric.replace(/\.+$/, "")
            onChange(valid && valid !== "." ? parseFloat(valid) : 0)
        } else {
            // Solo números enteros
            const numeric = inputValue.replace(/\D/g, "")
            onChange(numeric ? parseInt(numeric, 10) : 0)
        }
    }
    

    return (
        <div className="flex flex-col">
            <label className="flex items-center justify-between text-gray-900 font-normal mb-2">
                {label}
                {
                    tooltipText && <ToolTip tooltipText={tooltipText}/>
                }
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
                    {prefix}
                </span>
                <input
                    type={suffix === "%" ? "number" : "text"}
                    value={value}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 pl-7 pr-12 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 pointer-events-none">
                    {suffix}
                </span>
            </div>
        </div>
    )
}
