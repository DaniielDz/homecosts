import { CalculatorVariables } from "../types/calculator";
import { createHelpers } from "./helpers";

export type CalculationResult = [
    {
        v11: string;
        v12: string;
        v13: string;
    },
    {
        u11: string;
        u12: string;
        u13: string;
    },
    {
        v22: string;
        v23: string;
    },
    {
        z12: string;
        z13: string;
    }
]

export const convertUCtoTS = (
    ucFunctionString: string,
    variables: CalculatorVariables
) => {
    const helpers = createHelpers();

    const cleanedCode = ucFunctionString
        .replace(/function uc\(\)\s*{/, '')
        .replace(/}$/, '')
        .replace(
            /\$\(\s*['"]#(\w+)['"]\s*\)\s*\.html\s*\(\s*([\s\S]*?)\s*\)\s*;/g,
            '$1 = $2;'
        )
        .replace(
            /\$\(\s*[^)]+\s*\)\s*\.\w+\s*\([\s\S]*?\)\s*;/g,
            ''
        )
        .trim();

        

    return (params: Record<string, number>): CalculationResult => {
        const { w1: zipData, ...restParams } = params;

        const allVariables = {
            ...variables,
            w1: zipData,
            ...restParams
        };
        (cleanedCode)

        let u11 = '', u12 = '', u13 = '';
        let v11 = '', v12 = '', v13 = '', v22 = '', v23 = '';
        let z12 = '', z13 = '';

        const calculation = new Function(
            'vars', 'iv', 'mq', 'f0',
            `
            // Variables internas
            let s1 = 0, s2 = 0, lq = 0, z1 = 0, z2 = 0, p1 = 0;
            
            // Destructuring con valores por defecto
            const { 
            w1, 
            w2,
            w4,
            q,
            qVal,
            p2
            } = vars;
    
            // Recuperar variables de UI desde el closure
            let u11 = '', u12 = '', u13 = '';
            let v11 = '', v12 = '', v13 = '', v22 = '', v23 = '';
            let z12 = '', z13 = '';
            

            try {
            ${cleanedCode}
            } catch (e) {
            throw new Error(\`Error en cálculo: \${e.message}\`);
            }

            // Devolver resultados actualizados
            return [
                { v11, v12, v13 },
                { u11, u12, u13 },
                {v22, v23},
                {z12, z13 }
            ];`
        );

        return calculation(
            allVariables,
            helpers.iv,
            (v: number, u: string) => helpers.mq(v, u),
            helpers.f0
        );
    };
};