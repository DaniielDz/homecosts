import { CalculatorVariables } from '@/app/types/calculator';

interface SliderProps {
  label: string;
  sliderValues: { id: string; min: number; max: number; step: number };
  variables: CalculatorVariables;
  value: number;
  onChange: (id: string, value: number) => void;
}

export default function Slider({ label, sliderValues, variables, value, onChange }: SliderProps) {
  

  let tags: string[] = [];
  if (sliderValues.id === 'slider-1' && Array.isArray(variables.ll)) tags = variables.ll.filter((item): item is string => typeof item === 'string');
  if (sliderValues.id === 'slider-2' && Array.isArray(variables.ml)) tags = variables.ml.filter((item): item is string => typeof item === 'string');
  if (sliderValues.id === 'slider-4' && Array.isArray(variables.jl)) tags = variables.jl.filter((item): item is string => typeof item === 'string');

  const display =
    sliderValues.id !== 'slider-3'
      ? tags[value]
      : `${value} ${variables.qu}`;

  return (
    <div className="flex flex-col gap-4 w-full max-w-md p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm md:text-base text-gray-800 font-medium">{label}</span>
        <span className="text-sm md:text-base text-blue-700 font-medium">{display}</span>
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
