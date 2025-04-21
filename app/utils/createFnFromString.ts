export function createFunctionFromString(fnString: string): (x: number) => string {
    const trimmed = fnString.trim();
    const bodyStart = trimmed.indexOf("{") + 1;
    const bodyEnd = trimmed.lastIndexOf("}");
    const body = trimmed.substring(bodyStart, bodyEnd);

    return new Function("x", body) as (x: number) => string;
}