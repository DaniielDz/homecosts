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
                className="p-2.5 border bg-white border-[#D1D5DB] rounded-sm outline-0 font-normal appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                // 3) Value controla exactamente lo que hay en state
                value={value}
                // permitimos borrar todo porque solo actualizamos el state interno
                onChange={(e) => setValue(e.target.value)}
                // 4) Al salir (onBlur) notificamos al padre con número o cadena vacía
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
