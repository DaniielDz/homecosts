// Nueva interfaz:
interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
}

// Componente modificado:
export function Checkbox({ checked, onChange }: CheckboxProps) {
    return (
        <label className="inline-flex items-center cursor-pointer pt-0.5 md:pt-1">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="peer hidden"
            />
            <div className="w-4 h-4 rounded-sm border bg-white border-gray-300 peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-focus:ring-2 peer-focus:ring-blue-400 flex items-center justify-center transition"
            >
                {checked && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        </label>
    )
}