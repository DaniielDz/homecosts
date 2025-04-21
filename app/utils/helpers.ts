import { roundNumber } from "./functions";

export interface CalculationHelpers {
    iv: (e: number, t: number, a: number) => number;
    mq: (e: number, t: string) => string;
    f0: (e: number) => string;
}

export const createHelpers = (): CalculationHelpers => {
    // Función iv() original convertida
    const iv = (e: number, t: number, a: number): number => {
        if (a < 0.1) e *= 1.8539;
        else if (a >= 0.1 && a < 0.95) e *= 1.0893;

        return Math.max(e, t);
    };

    // Función mq() mejorada con tipado seguro
    const mq = (value: number, unit: string): string => {
        const lowerUnit = unit.toLowerCase();
        let fx = 1;

        // Aplicar factores de conversión solo para medidas específicas
        if (lowerUnit.includes('ft') || lowerUnit.includes('yd')) {
            if (value > 0 && value <= 20) fx = 1.09873;
            else if (value > 20 && value <= 100) fx = 1.06721;
            else if (value > 100) fx = 1.0463;
        }

        const adjustedValue = value * fx;
        let pluralizedUnit = unit;

        // Lógica de pluralización mejorada
        if (value === 1) {
            pluralizedUnit = unit.replace(/s$/, '');
        } else {
            const lastChar = unit.slice(-1).toLowerCase();
            switch (lastChar) {
                case 's':
                    break;
                case 'h':
                case 'x':
                case 'z':
                    pluralizedUnit = `${unit}es`;
                    break;
                case 'y':
                    pluralizedUnit = `${unit.slice(0, -1)}ies`;
                    break;
                default:
                    pluralizedUnit = `${unit}s`;
            }
        }

        return `${adjustedValue.toFixed(0)} ${pluralizedUnit}`;
    };

    // Función f0() con formateo monetario
    const f0 = (value: number): string => {
        const addCommas = (num: string): string => {
            const parts = num.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        };

        return `$${addCommas(roundNumber(value))}`;
    };

    return { iv, mq, f0 };
};