// Nueva interfaz:
interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
}

// Componente modificado:
export function Checkbox({ checked, onChange }: CheckboxProps) {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="peer hidden"
            />
            <div className="w-4 h-4 rounded-sm border bg-white peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-focus:ring-2 peer-focus:ring-blue-300 flex items-center justify-center transition"
                style={{ border: '1px solid #d1d5db' }}
            >
                {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        </label>
    )
}