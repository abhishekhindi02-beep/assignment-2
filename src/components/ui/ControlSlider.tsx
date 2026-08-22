interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  displayValue?: string;
  format?: (value: number) => string;
  className?: string;
  color?: 'navy' | 'violet' | 'amber';
}

export function ControlSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = '',
  displayValue,
  format,
  className = '',
}: ControlSliderProps) {
  const formattedVal = format ? format(value) : displayValue ?? `${value.toFixed(2)}${unit}`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-mono font-semibold text-violet-800">
          {formattedVal}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 cursor-pointer accent-violet-700"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default ControlSlider;
