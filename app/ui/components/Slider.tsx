import { CalculatorVariables } from '@/app/types/calculator';

interface SliderProps {
  label: string;
  sliderValues: { id: string; min: number; max: number; step: number };
  variables: CalculatorVariables;
  value: number;
  onChange: (id: string, value: number) => void;
}

export default function Slider({ label, sliderValues, variables, value, onChange }: SliderProps) {
  // Determinar etiquetas según id
  let tags: string[] = [];
  if (sliderValues.id === 'slider-1') tags = variables.ll;
  if (sliderValues.id === 'slider-2') tags = variables.ml;
  if (sliderValues.id === 'slider-4') tags = variables.jl;

  const display =
    sliderValues.id !== 'slider-3'
      ? tags[value]
      : `${value} ${variables.qu}`;

  return (
    <div className="flex flex-col gap-4 w-full max-w-md p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-800 font-medium">{label}</span>
        <span className="text-sm text-blue-700 font-medium">{display}</span>
      </div>
      <input
        type="range"
        id={sliderValues.id}
        min={sliderValues.min}
        max={sliderValues.max}
        step={sliderValues.step}
        value={value}
        onChange={(e) => onChange(sliderValues.id, Number(e.target.value))}
        className="w-full cursor-pointer range-minimal"
      />
    </div>
  );
}
