import { Slider } from "../ui/slider";

/*
Componentes de input reutilizáveis.
Sliders para range e valor simples.
*/

interface ValueSliderProps {
    value: number;
    setValue: (v: number) => void;
    min: number;
    max: number;
    step: number;
}

export function ValueSlider({
    value,
    setValue,
    min,
    max,
    step,
}: ValueSliderProps) {
    function handleChange(v: number | readonly number[]) {
        if (typeof v === "number") {
            setValue(v);
        }
    }

    return (
        <div>
            <Slider
                onValueChange={handleChange}
                value={value}
                min={min}
                max={max}
                step={step}
            />
            <div className="flex justify-between">
                <span className="text-muted-foreground">{min}</span>
                <span className="text-muted-foreground">{max}</span>
            </div>
        </div>
    );
}

interface RangeSliderProps {
    values: number[];
    setValues: (v: number[]) => void;
    min: number;
    max: number;
    step: number;
}

export function RangeSlider({
    values,
    setValues,
    min,
    max,
    step,
}: RangeSliderProps) {
    function handleChange(v: number | readonly number[]) {
        if (typeof v !== "number") {
            setValues([...v]);
        }
    }

    return (
        <div>
            <Slider
                onValueChange={handleChange}
                value={values}
                min={min}
                max={max}
                step={step}
            />
            <div className="flex justify-between">
                <span className="text-muted-foreground">{min}</span>
                <span className="text-muted-foreground">{max}</span>
            </div>
        </div>
    );
}
