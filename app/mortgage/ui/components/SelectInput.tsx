"use client"

import { ChevronDown } from "lucide-react"
import React from "react"
import ToolTip from "./Tooltip"

interface Option {
    value: string
    label: string
}

interface SelectInputProps {
    label: string
    options: Option[]
    value: string
    onChange: (value: string) => void
}

export function SelectInput({
    label,
    options,
    value,
    onChange,
}: SelectInputProps) {
    return (
        <div className="flex flex-col w-full">
            <label className="flex items-center justify-between text-sm md:text-base text-gray-900 font-semibold mb-2">
                {label}
                <ToolTip tooltipText="Select the duration of the loan term." />
            </label>

            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="block w-full appearance-none border border-gray-300 rounded-md py-2 pl-4 pr-8 text-gray-700 focus:outline-none focus:border-blue-500"
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2" />
            </div>
        </div>
    )
}
