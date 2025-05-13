"use client"

import React, { useEffect, useState } from "react"
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
    const [displayPct, setDisplayPct] = useState<string>(
        percentValue?.toString() || ""
    );
    const [pctFocused, setPctFocused] = useState(false);
    const [displayAmt, setDisplayAmt] = useState<string>(
        currencyValue?.toString() || ""
    );
    const [AmtFocused, setAmtFocused] = useState(false);

    useEffect(() => {
        if (!pctFocused) {
            let value = percentValue === "" || percentValue === null ? "" : percentValue.toString();
            if (value.includes(".")) {
                const parts = value.split(".");
                if (parts[1].length > 2) {
                    value = parts[0] + "." + parts[1].substring(0, 2);
                }
            }

            setDisplayPct(value);
        }
    }, [percentValue, pctFocused]);

    const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value.replace(/[^0-9.]/g, "");

        const parts = raw.split(".");
        if (parts.length > 2) {
            raw = parts[0] + "." + parts.slice(1).join("");
        }

        if (parts.length === 2) {
            raw = parts[0] + "." + parts[1].slice(0, 2);
        }

        setDisplayPct(raw);
        onPercentChange(raw ? parseFloat(raw) : 0);
    };
    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numeric = e.target.value.replace(/\D/g, "");
        setDisplayAmt(numeric);
        onCurrencyChange(numeric ? parseInt(numeric, 10) : 0);
    };

    const formatNumber = (val: number | string) => {
        if (val === "" || val === null || val === undefined) return "";

        const num = typeof val === "number"
            ? val
            : parseInt(val.toString().replace(/\D/g, ""), 10);

        return isNaN(num) ? "" : num.toLocaleString();
    };

    useEffect(() => {
        if (!AmtFocused) {
            setDisplayAmt(
                currencyValue === "" || currencyValue === null || currencyValue === undefined
                    ? ""
                    : currencyValue.toString()
            );
        }
    }, [currencyValue, AmtFocused]);

    return (
        <div className="flex flex-col w-full max-w-sm">
            <label className="flex items-center justify-between text-sm md:text-base text-gray-900 font-semibold mb-2">
                {label}
                <ToolTip tooltipText="Enter your desired down payment amount and percentage." />
            </label>
            <div
                className="group flex border border-gray-300 rounded-md overflow-hidden focus-within:border-blue-500">
                <div className="flex items-center pl-3 pr-2 bg-white">
                    <span className="text-gray-500">$</span>
                </div>
                <input
                    type="text"
                    value={formatNumber(displayAmt)}
                    onChange={handleCurrencyChange}
                    onFocus={() => setAmtFocused(true)}
                    onBlur={() => setAmtFocused(false)}
                    className="w-1/2 pr-2 py-2 focus:outline-none"
                />
                <div className="w-px bg-gray-300 group-focus-within:bg-blue-500" />
                <input
                    type="text"
                    value={displayPct}
                    onChange={handlePercentChange}
                    onFocus={() => setPctFocused(true)}
                    onBlur={() => setPctFocused(false)}
                    className="w-1/4 px-2 py-2 text-center focus:outline-none"
                />
                <div className="flex items-center px-3 bg-white">
                    <span className="text-gray-500">%</span>
                </div>
            </div>
        </div >
    )
}
