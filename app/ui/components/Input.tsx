import { useState, useEffect } from "react";

interface InputProps {
    name: string;
    label: string;
    initialValue?: number;
    onChange: (value: number | "") => void;
}

export function Input({ name, label, initialValue, onChange }: InputProps) {
    // 1) Estado interno como string
    const [value, setValue] = useState<string>(
        initialValue !== undefined ? initialValue.toString() : ""
    );

    // 2) Sincronizar cuando cambie initialValue desde el padre
    useEffect(() => {
        setValue(initialValue !== undefined ? initialValue.toString() : "");
    }, [initialValue]);

    return (
        <label
            className="max-w-44 flex flex-col gap-1 text-sm text-[#111827] font-semibold"
            htmlFor={name}
        >
            {label}
            <input
                id={name}
                name={name}
                type="number"
                className="h-9.5 p-2.5 border bg-white border-gray-300 rounded-sm outline-0 font-normal appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-blue-500 transition-all duration-300"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => {
                    const trimmed = value.trim();
                    if (trimmed === "") {
                        onChange("");
                    } else {
                        const num = Number(trimmed);
                        onChange(isNaN(num) ? "" : num);
                    }
                }}
            />
        </label>
    );
}
