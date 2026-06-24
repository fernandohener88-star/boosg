export function TrackingField({
  label,
  value,
  onChange,
  step,
  min,
  max
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  step: number;
  min?: number;
  max?: number;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase text-muted tracking-wide leading-tight">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        value={value ?? ''}
        step={step}
        min={min}
        max={max}
        placeholder="–"
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        className="w-full rounded-lg border border-line bg-panel2 px-2 py-1.5 text-sm font-mono text-chalk focus:outline-none focus:border-phase-aufbau"
      />
    </label>
  );
}
