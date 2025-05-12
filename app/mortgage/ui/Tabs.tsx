"use client"

import React, { useState } from 'react'

interface TabsProps {
    tabs: string[];
    initialIndex?: number;
    onChange?: (index: number) => void;
}

export function Tabs({ tabs, initialIndex = 0, onChange }: TabsProps) {
    const [activeIndex, setActiveIndex] = useState(initialIndex)

    const handleClick = (index: number) => {
        setActiveIndex(index)
        if (onChange) onChange(index)
    }

    const tabCount = tabs.length
    const underlineStyle: React.CSSProperties = {
        width: `${100 / tabCount}%`,
        top: '98%',
        left: `${(activeIndex * 100) / tabCount}%`,
        transition: 'left 0.3s ease',
    }

    return (
        <div className="max-w-[300px] relative">
            <div className="flex">
                {tabs.map((label, idx) => (
                    <button
                        key={idx}
                        className={`flex-1 text-center text-sm py-5 cursor-pointer focus:outline-none ${idx === activeIndex
                                ? 'text-blue-600 font-semibold'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => handleClick(idx)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div
                className="absolute bottom-0 h-[2px] bg-blue-500"
                style={underlineStyle}
            />
        </div>
    )
}
